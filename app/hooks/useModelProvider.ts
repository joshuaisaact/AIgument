import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createXai } from "@ai-sdk/xai";
import { getApiKey } from "../lib/storage/apiKeyStorage";

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

export type ModelType =
  | "gpt4o"
  | "gpt4"
  | "gpt35"
  | "claude-sonnet"
  | "claude-haiku"
  | "gemini-flash"
  | "gemini-pro"
  | "gemini-2.5-flash"
  | "grok-3"
  | "grok-3-mini";

export const useModelProvider = () => {
  const getModelProvider = (model: ModelType) => {
    try {
      switch (model) {
        case "claude-sonnet":
          return createAnthropic({
            apiKey: getProviderApiKey("anthropic"),
          })("claude-3-7-sonnet-20250219");
        case "claude-haiku":
          return createAnthropic({
            apiKey: getProviderApiKey("anthropic"),
          })("claude-3-5-haiku-latest");
        case "gpt4o":
          return createOpenAI({
            apiKey: getProviderApiKey("openai"),
            compatibility: "strict",
          })("gpt-4o");
        case "gpt4":
          return createOpenAI({
            apiKey: getProviderApiKey("openai"),
            compatibility: "strict",
          })("gpt-4-turbo");
        case "gpt35":
          return createOpenAI({
            apiKey: getProviderApiKey("openai"),
            compatibility: "strict",
          })("gpt-3.5-turbo");
        case "gemini-flash":
          return createGoogleGenerativeAI({
            apiKey: getProviderApiKey("google"),
          })("gemini-2.0-flash-001");
        case "gemini-pro":
          return createGoogleGenerativeAI({
            apiKey: getProviderApiKey("google"),
          })("gemini-2.5-pro-exp-03-25");
        case "gemini-2.5-flash":
          return createGoogleGenerativeAI({ apiKey: undefined })(
            "gemini-2.5-flash-preview-04-17",
          );
        case "grok-3":
          return createXai({
            apiKey: getProviderApiKey("xai"),
          })("grok-3");
        case "grok-3-mini":
          return createXai({
            apiKey: getProviderApiKey("xai"),
          })("grok-3-mini");
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
