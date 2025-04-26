import { ModelType } from "../hooks/useModelProvider";

export const MODEL_CONFIGS: Record<
  ModelType,
  { name: string; logo: string; alt: string; description: string }
> = {
  gpt4o: {
    name: "ChatGPT-4 Omni",
    logo: "/openai.svg",
    alt: "ChatGPT-4 Omni",
    description: "OpenAI&apos;s latest flagship model.",
  },
  gpt4: {
    name: "ChatGPT-4 Turbo",
    logo: "/openai.svg",
    alt: "ChatGPT-4 Turbo (latest)",
    description: "OpenAI&apos;s most capable model.",
  },
  gpt35: {
    name: "ChatGPT-3.5 Turbo",
    logo: "/openai.svg",
    alt: "ChatGPT-3.5 Turbo (latest)",
    description: "Fast and affordable model.",
  },
  "claude-sonnet": {
    name: "Claude 3.7 Sonnet",
    logo: "/anthropic.svg",
    alt: "Claude 3.7 Sonnet (latest)",
    description: "Anthropic&apos;s latest powerful model.",
  },
  "claude-haiku": {
    name: "Claude 3.5 Haiku",
    logo: "/anthropic.svg",
    alt: "Claude 3.5 Haiku (latest)",
    description: "Anthropic&apos;s fastest, compact model.",
  },
  "gemini-flash": {
    name: "Gemini 2.0 Flash",
    logo: "/google.svg",
    alt: "Gemini 1.5 Flash",
    description: "Google&apos;s fast multimodal model.",
  },
  "gemini-pro": {
    name: "Gemini 2.5 Pro",
    logo: "/google.svg",
    alt: "Gemini 1.5 Pro",
    description: "Google&apos;s latest capable model.",
  },
  "gemini-2.5-flash": {
    name: "Gemini 2.5 Flash",
    logo: "/google.svg",
    alt: "Gemini 2.5 Flash Preview",
    description: "Google&apos;s fast and efficient model.",
  },
  "grok-3": {
    name: "Grok 3",
    logo: "/xai.svg",
    alt: "Grok 3",
    description: "xAI&apos;s large conversational model.",
  },
  "grok-3-mini": {
    name: "Grok 3 Mini",
    logo: "/xai.svg",
    alt: "Grok 3 Mini",
    description: "xAI&apos;s smaller, faster model.",
  },
};
