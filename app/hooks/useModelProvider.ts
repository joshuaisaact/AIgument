import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

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
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  compatibility: 'strict',
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '',
});

const anthropic = createAnthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

export type ModelType = 'gpt4' | 'gpt35' | 'claude' | 'gemini';

export const useModelProvider = () => {
  const getModelProvider = (model: ModelType) => {
    switch (model) {
      case "claude":
        return anthropic("claude-3-sonnet");
      case "gpt4":
        return openai("gpt-4-turbo");
      case "gpt35":
        return openai("gpt-3.5-turbo");
      case "gemini":
        return google("gemini-1.5-flash");
      default:
        throw new Error(`Unknown model: ${model}`);
    }
  };

  return {
    getModelProvider,
    debugEnv
  };
};