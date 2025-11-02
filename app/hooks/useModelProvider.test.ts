import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useModelProvider, MissingApiKeyError } from "./useModelProvider";

// Mock the AI SDK modules
vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() =>
    vi.fn((model: string) => ({ model, provider: "openai" })),
  ),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  createAnthropic: vi.fn(() =>
    vi.fn((model: string) => ({ model, provider: "anthropic" })),
  ),
}));

vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: vi.fn(() =>
    vi.fn((model: string) => ({ model, provider: "google" })),
  ),
}));

vi.mock("@ai-sdk/xai", () => ({
  createXai: vi.fn(() =>
    vi.fn((model: string) => ({ model, provider: "xai" })),
  ),
}));

vi.mock("../lib/storage/apiKeyStorage", () => ({
  getApiKey: vi.fn(() => null),
}));

describe("MissingApiKeyError", () => {
  it("should create error with correct message and name", () => {
    const error = new MissingApiKeyError("openai");

    expect(error.message).toBe(
      "No API key found for openai. Please add your API key in the settings.",
    );
    expect(error.name).toBe("MissingApiKeyError");
    expect(error).toBeInstanceOf(Error);
  });

  it("should create error for different providers", () => {
    const providers = ["openai", "anthropic", "google", "xai"];

    providers.forEach((provider) => {
      const error = new MissingApiKeyError(provider);
      expect(error.message).toContain(provider);
    });
  });
});

describe("useModelProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    delete process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    delete process.env.NEXT_PUBLIC_XAI_API_KEY;
  });

  describe("getModelProvider - error paths", () => {
    it("should throw MissingApiKeyError when OpenAI key is missing", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() => {
        result.current.getModelProvider("gpt4o");
      }).toThrow(MissingApiKeyError);

      expect(() => {
        result.current.getModelProvider("gpt4o");
      }).toThrow("No API key found for openai");
    });

    it("should throw MissingApiKeyError when Anthropic key is missing", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() => {
        result.current.getModelProvider("claude-sonnet");
      }).toThrow(MissingApiKeyError);

      expect(() => {
        result.current.getModelProvider("claude-sonnet");
      }).toThrow("No API key found for anthropic");
    });

    it("should throw MissingApiKeyError when Google key is missing", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() => {
        result.current.getModelProvider("gemini-flash");
      }).toThrow(MissingApiKeyError);

      expect(() => {
        result.current.getModelProvider("gemini-flash");
      }).toThrow("No API key found for google");
    });

    it("should throw MissingApiKeyError when xAI key is missing", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() => {
        result.current.getModelProvider("grok-3");
      }).toThrow(MissingApiKeyError);

      expect(() => {
        result.current.getModelProvider("grok-3");
      }).toThrow("No API key found for xai");
    });
  });

  describe("getModelProvider - happy path with env variables", () => {
    it("should work with OpenAI env variable", () => {
      process.env.NEXT_PUBLIC_OPENAI_API_KEY = "sk-test123";
      const { result } = renderHook(() => useModelProvider());

      const provider = result.current.getModelProvider("gpt4o");
      expect(provider).toBeDefined();
    });

    it("should work with Anthropic env variable", () => {
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = "sk-ant-test123";
      const { result } = renderHook(() => useModelProvider());

      const provider = result.current.getModelProvider("claude-sonnet");
      expect(provider).toBeDefined();
    });

    it("should work with Google env variable", () => {
      process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY = "AIza-test123";
      const { result } = renderHook(() => useModelProvider());

      const provider = result.current.getModelProvider("gemini-flash");
      expect(provider).toBeDefined();
    });

    it("should work with xAI env variable", () => {
      process.env.NEXT_PUBLIC_XAI_API_KEY = "gsk_test123";
      const { result } = renderHook(() => useModelProvider());

      const provider = result.current.getModelProvider("grok-3");
      expect(provider).toBeDefined();
    });
  });

  describe("getModelProvider - model variations", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_OPENAI_API_KEY = "sk-test123";
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY = "sk-ant-test123";
      process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY = "AIza-test123";
      process.env.NEXT_PUBLIC_XAI_API_KEY = "gsk_test123";
    });

    it("should handle all GPT model variants", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() => result.current.getModelProvider("gpt4o")).not.toThrow();
      expect(() => result.current.getModelProvider("gpt4")).not.toThrow();
      expect(() => result.current.getModelProvider("gpt35")).not.toThrow();
    });

    it("should handle all Claude model variants", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() =>
        result.current.getModelProvider("claude-sonnet"),
      ).not.toThrow();
      expect(() =>
        result.current.getModelProvider("claude-haiku"),
      ).not.toThrow();
    });

    it("should handle all Gemini model variants", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() =>
        result.current.getModelProvider("gemini-flash"),
      ).not.toThrow();
      expect(() => result.current.getModelProvider("gemini-pro")).not.toThrow();
    });

    it("should handle gemini-2.5-flash without API key (demo mode)", () => {
      delete process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
      const { result } = renderHook(() => useModelProvider());

      // This should NOT throw because gemini-2.5-flash uses apiKey: undefined
      expect(() =>
        result.current.getModelProvider("gemini-2.5-flash"),
      ).not.toThrow();
    });

    it("should handle all Grok model variants", () => {
      const { result } = renderHook(() => useModelProvider());

      expect(() => result.current.getModelProvider("grok-3")).not.toThrow();
      expect(() =>
        result.current.getModelProvider("grok-3-mini"),
      ).not.toThrow();
    });
  });
});
