import { ModelType } from '../hooks/useModelProvider';

export const DEBATE_PROMPTS = {
  getSystemPrompt: (topic: string, position: 'PRO' | 'CON', previousArguments: string) => {
    return `You are participating in a debate about "${topic}". You are taking the ${position} position.
${previousArguments ? `Previous arguments:\n${previousArguments}\n\nNow it's your turn to respond.` : 'Make your opening argument.'}
Keep your response concise and focused on the topic.`;
  }
};

export const MODEL_CONFIGS: Record<ModelType, { name: string; logo: string; alt: string }> = {
  gpt4: {
    name: 'ChatGPT-4 Turbo',
    logo: '/openai.svg',
    alt: 'ChatGPT-4 Turbo (latest)'
  },
  gpt35: {
    name: 'ChatGPT-3.5 Turbo',
    logo: '/openai.svg',
    alt: 'ChatGPT-3.5 Turbo (latest)'
  },
  'claude-sonnet': {
    name: 'Claude 3.7 Sonnet',
    logo: '/anthropic.svg',
    alt: 'Claude 3.7 Sonnet (latest)'
  },
  'claude-haiku': {
    name: 'Claude 3.5 Haiku',
    logo: '/anthropic.svg',
    alt: 'Claude 3.5 Haiku (latest)'
  },
  'gemini-flash': {
    name: 'Gemini 2.0 Flash',
    logo: '/google.svg',
    alt: 'Gemini 1.5 Flash'
  },
  'gemini-pro': {
    name: 'Gemini 2.5 Pro',
    logo: '/google.svg',
    alt: 'Gemini 1.5 Pro'
  }
};