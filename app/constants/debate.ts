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
    name: 'GPT-4',
    logo: '/openai.svg',
    alt: 'GPT-4'
  },
  gpt35: {
    name: 'GPT-3.5',
    logo: '/openai.svg',
    alt: 'GPT-3.5'
  },
  claude: {
    name: 'Claude',
    logo: '/anthropic.svg',
    alt: 'Claude'
  },
  gemini: {
    name: 'Gemini',
    logo: '/google.svg',
    alt: 'Gemini'
  }
};