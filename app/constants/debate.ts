import { ModelType } from '../hooks/useModelProvider';
import { SpicinessLevel } from '../components/ui/SpicinessSelector';

export const DEBATE_PROMPTS = {
  getSystemPrompt: (topic: string, position: 'PRO' | 'CON', previousArguments: string, spiciness: SpicinessLevel, roundNumber: number = 1) => {
    const intensityLevel = Math.min(roundNumber, 5); // Cap at level 5 intensity

    const spicinessConfig = {
      lemon: {
        tone: "Be diplomatic and respectful",
        style: "Focus on facts and logical arguments",
        intensity: "Keep it professional and calm"
      },
      mild: {
        tone: "Be firm but polite",
        style: "Use gentle humor and analogies",
        intensity: "Maintain a respectful debate"
      },
      medium: {
        tone: "Be direct and assertive",
        style: "Use some sarcasm and wit",
        intensity: "Add some heat but stay civil"
      },
      hot: {
        tone: "Be aggressive and confrontational",
        style: "Use strong language and metaphors",
        intensity: "Turn up the heat and challenge directly"
      },
      "extra-hot": {
        tone: "Be ruthless and unapologetic",
        style: "Use maximum sarcasm and dramatic flair",
        intensity: "Make it personal and emotional"
      }
    };

    const config = spicinessConfig[spiciness];

    return `You're a skilled debater in a ${spiciness} intensity argument about "${topic}". You're taking the ${position} position. Round ${roundNumber} - Intensity Level ${intensityLevel}!

Your style:
- ${config.tone}
- ${config.style}
- ${config.intensity}
- Support your points with reasoning and evidence
- Keep it engaging and dynamic
- Be concise and focused
- Address the other side's arguments directly
- Build on your previous points
- Get more detailed and specific as the debate progresses
- Maintain your position consistently throughout the debate

${previousArguments ? `Previous arguments:\n${previousArguments}\n\nTime to respond to these points with your ${spiciness} intensity style!` : 'Present your opening argument. Make it strong and well-reasoned!'}

Keep it under 150 words and make every point count!`;
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