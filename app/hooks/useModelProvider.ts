import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getApiKey } from '../lib/storage/apiKeyStorage';

export class MissingApiKeyError extends Error {
  constructor(provider: string) {
    super(`No API key found for ${provider}. Please add your API key in the settings.`);
    this.name = 'MissingApiKeyError';
  }
}

// Debug environment variables
const debugEnv = () => {
  const env = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
  };
  console.log('Environment variables:', env);
  return env;
};

const getProviderApiKey = (provider: 'openai' | 'google' | 'anthropic') => {
  const userKey = getApiKey(provider);
  const envKey = process.env[`NEXT_PUBLIC_${provider.toUpperCase()}_API_KEY`];

  if (!userKey && !envKey) {
    throw new MissingApiKeyError(provider);
  }

  return userKey || envKey || '';
};

export type ModelType = 'gpt4' | 'gpt35' | 'claude-sonnet' | 'claude-haiku' | 'gemini-flash' | 'gemini-pro';

export const useModelProvider = () => {
  const getModelProvider = (model: ModelType) => {
    try {
      switch (model) {
        case "claude-sonnet":
        case "claude-haiku":
          return createAnthropic({
            apiKey: getProviderApiKey('anthropic'),
          })(model === "claude-sonnet" ? "claude-3-7-sonnet-20250219" : "claude-3-5-haiku-latest");
        case "gpt4":
        case "gpt35":
          return createOpenAI({
            apiKey: getProviderApiKey('openai'),
            compatibility: 'strict',
          })(model === "gpt4" ? "gpt-4-turbo" : "gpt-3.5-turbo");
        case "gemini-flash":
        case "gemini-pro":
          return createGoogleGenerativeAI({
            apiKey: getProviderApiKey('google'),
          })(model === "gemini-flash" ? "gemini-2.0-flash-001" : "gemini-2.5-pro-exp-03-25");
        default:
          throw new Error(`Unknown model: ${model}`);
      }
    } catch (error: unknown) {
      if (error instanceof MissingApiKeyError) {
        throw error;
      }
      throw new Error(`Failed to initialize model provider: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    getModelProvider,
    debugEnv
  };
};