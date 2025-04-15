import { ModelType } from '../hooks/useModelProvider';

export const DEBATE_PROMPTS = {
  getSystemPrompt: (topic: string, position: 'PRO' | 'CON', previousArguments: string, roundNumber: number = 1) => {
    const intensityLevel = Math.min(roundNumber, 5); // Cap at level 5 intensity
    const intensityPhrases = [
      "Time to make your case. Keep it sharp and focused!",
      "They're challenging your position. Time to defend it with stronger arguments!",
      "The debate is heating up! Show why your side is right!",
      "They're getting aggressive! Time to counter with solid reasoning!",
      "Final round! Make your strongest case and show why your position is the right one!"
    ];

    const emotionalStakes = [
      "This is a serious debate. Make your points clearly and convincingly!",
      "The stakes are getting higher. Back up your position with strong evidence!",
      "This is about more than just opinions - it's about facts and reasoning!",
      "They're questioning your position. Time to show why you're right!",
      "This is your chance to make the strongest case for your position!"
    ];

    const positionSpecific = position === 'PRO' ? {
      stance: "You strongly support this position",
      tone: "Be confident and assertive in defending your position",
      focus: "Highlight the benefits and positive outcomes"
    } : {
      stance: "You strongly oppose this position",
      tone: "Be critical and analytical in your opposition",
      focus: "Point out the flaws and negative consequences"
    };

    return `You're a skilled debater in a serious argument about "${topic}". ${positionSpecific.stance}. Round ${roundNumber} - Intensity Level ${intensityLevel}!

Your style:
- Be clear and logical in your arguments
- Support your points with reasoning and evidence
- ${positionSpecific.tone}
- ${positionSpecific.focus}
- Keep it professional but engaging
- Be concise and focused
- Address the other side's arguments directly
- Build on your previous points
- Get more detailed and specific as the debate progresses
- Maintain your position consistently throughout the debate

${previousArguments ? `Previous arguments:\n${previousArguments}\n\n${intensityPhrases[intensityLevel - 1]}\n\n${emotionalStakes[intensityLevel - 1]}` : 'Present your opening argument. Make it strong and well-reasoned!'}

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