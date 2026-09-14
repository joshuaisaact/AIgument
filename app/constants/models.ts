import { ModelType } from "../hooks/useModelProvider";

export const MODEL_CONFIGS: Record<
  ModelType,
  { name: string; logo: string; alt: string; description: string }
> = {
  "gpt-6-astra": {
    name: "GPT-6 Astra",
    logo: "/openai.svg",
    alt: "GPT-6 Astra",
    description: "OpenAI&apos;s flagship.",
  },
  "gpt-5.4-mini": {
    name: "GPT-5.4 Mini",
    logo: "/openai.svg",
    alt: "GPT-5.4 Mini",
    description: "Cheaper and quicker than the flagship.",
  },
  "claude-opus-5": {
    name: "Claude Opus 5",
    logo: "/anthropic.svg",
    alt: "Claude Opus 5",
    description: "Anthropic&apos;s most capable model.",
  },
  "claude-sonnet-5": {
    name: "Claude Sonnet 5",
    logo: "/anthropic.svg",
    alt: "Claude Sonnet 5",
    description: "Balanced for everyday argument.",
  },
  "claude-haiku-4-5": {
    name: "Claude Haiku 4.5",
    logo: "/anthropic.svg",
    alt: "Claude Haiku 4.5",
    description: "Anthropic&apos;s fastest, compact model.",
  },
  "gemini-3.8-flash": {
    name: "Gemini 3.8 Flash",
    logo: "/google.svg",
    alt: "Gemini 3.8 Flash",
    description: "Google&apos;s fast multimodal model.",
  },
  "gemini-2.5-pro": {
    name: "Gemini 2.5 Pro",
    logo: "/google.svg",
    alt: "Gemini 2.5 Pro",
    description: "Google&apos;s reasoning model.",
  },
  "grok-4.6": {
    name: "Grok 4.6",
    logo: "/xai.svg",
    alt: "Grok 4.6",
    description: "xAI&apos;s flagship.",
  },
  "grok-4-1-fast-reasoning": {
    name: "Grok 4.1 Fast",
    logo: "/xai.svg",
    alt: "Grok 4.1 Fast",
    description: "xAI&apos;s quick reasoning model.",
  },
  "gemini-demo": {
    name: "Gemini 3.8 Flash (demo)",
    logo: "/google.svg",
    alt: "Gemini 3.8 Flash",
    description: "Runs on our key. No API key needed.",
  },
};
