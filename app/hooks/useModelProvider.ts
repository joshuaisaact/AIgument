import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getApiKey } from '../lib/storage/apiKeyStorage';


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

// Configure providers
const openai = createOpenAI({
  apiKey: getApiKey('openai') || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  compatibility: 'strict',
});

const google = createGoogleGenerativeAI({
  apiKey: getApiKey('google') || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '',
});

const anthropic = createAnthropic({
  apiKey: getApiKey('anthropic') || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

export type ModelType = 'gpt4' | 'gpt35' | 'claude-sonnet' | 'claude-haiku' | 'gemini-flash' | 'gemini-pro';

export const useModelProvider = () => {
  const getModelProvider = (model: ModelType) => {
    switch (model) {
      case "claude-sonnet":
        return anthropic("claude-3-7-sonnet-20250219");
      case "claude-haiku":
        return anthropic("claude-3-5-haiku-latest");
      case "gpt4":
        return openai("gpt-4-turbo");
      case "gpt35":
        return openai("gpt-3.5-turbo");
      case "gemini-flash":
        return google("gemini-2.0-flash-001");
      case "gemini-pro":
        return google('gemini-2.5-pro-exp-03-25');
      default:
        throw new Error(`Unknown model: ${model}`);
    }
  };

  return {
    getModelProvider,
    debugEnv
  };
};