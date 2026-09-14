import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createXai } from "@ai-sdk/xai";
import { getApiKey } from "../lib/storage/apiKeyStorage";

/** The model behind demo mode. Shared with /api/gemini-flash. */
export const DEMO_MODEL_ID = "gemini-3.8-flash";

export class MissingApiKeyError extends Error {
  constructor(provider: string) {
    super(
      `No API key found for ${provider}. Please add your API key in the settings.`,
    );
    this.name = "MissingApiKeyError";
  }
}

const getProviderApiKey = (
  provider: "openai" | "google" | "anthropic" | "xai",
) => {
  const userKey = getApiKey(provider);
  const envVarMap = {
    openai: "NEXT_PUBLIC_OPENAI_API_KEY",
    google: "NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY",
    anthropic: "NEXT_PUBLIC_ANTHROPIC_API_KEY",
    xai: "NEXT_PUBLIC_XAI_API_KEY",
  };
  const envKey = process.env[envVarMap[provider]];

  if (!userKey && !envKey) {
    throw new MissingApiKeyError(provider);
  }

  return userKey || envKey || "";
};

/**
 * Model ids are the providers' own, and deliberately the floating names rather
 * than dated snapshots (`claude-opus-5`, not `claude-opus-5-20260114`), so the
 * app follows each provider's current release without a code change.
 */
export type ModelType =
  | "gpt-6-astra"
  | "gpt-5.4-mini"
  | "claude-opus-5"
  | "claude-sonnet-5"
  | "claude-haiku-4-5"
  | "gemini-3.8-flash"
  | "gemini-2.5-pro"
  | "grok-4.6"
  | "grok-4-1-fast-reasoning"
  | "gemini-demo";

export const useModelProvider = () => {
  const getModelProvider = (model: ModelType) => {
    try {
      switch (model) {
        case "claude-opus-5":
        case "claude-sonnet-5":
        case "claude-haiku-4-5":
          return createAnthropic({
            apiKey: getProviderApiKey("anthropic"),
          })(model);
        case "gpt-6-astra":
        case "gpt-5.4-mini":
          return createOpenAI({
            apiKey: getProviderApiKey("openai"),
          })(model);
        case "gemini-3.8-flash":
        case "gemini-2.5-pro":
          return createGoogleGenerativeAI({
            apiKey: getProviderApiKey("google"),
          })(model);
        case "grok-4.6":
        case "grok-4-1-fast-reasoning":
          return createXai({
            apiKey: getProviderApiKey("xai"),
          })(model);
        case "gemini-demo":
          // Answered server-side by /api/gemini-flash on our own key, so this
          // instance is never used to call out from the browser.
          return createGoogleGenerativeAI({ apiKey: undefined })(
            DEMO_MODEL_ID,
          );
        default:
          const _exhaustiveCheck: never = model;
          throw new Error(`Unknown model: ${_exhaustiveCheck}`);
      }
    } catch (error: unknown) {
      if (error instanceof MissingApiKeyError) {
        throw error;
      }
      throw new Error(
        `Failed to initialize model provider: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return {
    getModelProvider,
  };
};
