import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  setApiKey,
  getApiKey,
  clearApiKey,
  validateApiKeyFormat,
} from "./apiKeyStorage";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("setApiKey and getApiKey", () => {
  it("should store and retrieve OpenAI API key", () => {
    const testKey = "sk-test1234567890abcdefghijklmnop";
    setApiKey(testKey, "openai");
    expect(getApiKey("openai")).toBe(testKey);
  });

  it("should store and retrieve Anthropic API key", () => {
    const testKey = "sk-ant-test1234567890abcdefghijklmnop";
    setApiKey(testKey, "anthropic");
    expect(getApiKey("anthropic")).toBe(testKey);
  });

  it("should return null for non-existent key", () => {
    expect(getApiKey("openai")).toBeNull();
  });

  it("should overwrite existing key", () => {
    setApiKey("old-key", "openai");
    setApiKey("new-key", "openai");
    expect(getApiKey("openai")).toBe("new-key");
  });
});

describe("clearApiKey", () => {
  it("should remove stored API key", () => {
    const testKey = "sk-test1234567890abcdefghijklmnop";
    setApiKey(testKey, "openai");
    clearApiKey("openai");
    expect(getApiKey("openai")).toBeNull();
  });

  it("should not affect other provider keys", () => {
    setApiKey("openai-key", "openai");
    setApiKey("anthropic-key", "anthropic");
    clearApiKey("openai");
    expect(getApiKey("openai")).toBeNull();
    expect(getApiKey("anthropic")).toBe("anthropic-key");
  });
});

describe("validateApiKeyFormat - happy path", () => {
  it("should validate correct OpenAI key format", () => {
    const validKey = "sk-abcdefghijklmnopqrstuvwxyz123456";
    expect(validateApiKeyFormat(validKey, "openai")).toBe(true);
  });

  it("should validate correct Anthropic key format", () => {
    const validKey = "sk-ant-abcdefghijklmnopqrstuvwxyz123456";
    expect(validateApiKeyFormat(validKey, "anthropic")).toBe(true);
  });

  it("should validate correct Google key format", () => {
    const validKey = "AIzaAbCdEfGhIjKlMnOpQrStUvWxYz1234567890";
    expect(validateApiKeyFormat(validKey, "google")).toBe(true);
  });

  it("should validate correct xAI key format", () => {
    const validKey = "gsk_" + "a".repeat(60);
    expect(validateApiKeyFormat(validKey, "xai")).toBe(true);
  });
});

describe("validateApiKeyFormat - error path", () => {
  it("should reject OpenAI key with wrong prefix", () => {
    const invalidKey = "pk-abcdefghijklmnopqrstuvwxyz123456";
    expect(validateApiKeyFormat(invalidKey, "openai")).toBe(false);
  });

  it("should reject OpenAI key that is too short", () => {
    const invalidKey = "sk-short";
    expect(validateApiKeyFormat(invalidKey, "openai")).toBe(false);
  });

  it("should reject Anthropic key with wrong prefix", () => {
    const invalidKey = "sk-abcdefghijklmnopqrstuvwxyz123456";
    expect(validateApiKeyFormat(invalidKey, "anthropic")).toBe(false);
  });

  it("should reject Google key with wrong prefix", () => {
    const invalidKey = "BIzaAbCdEfGhIjKlMnOpQrStUvWxYz1234567890";
    expect(validateApiKeyFormat(invalidKey, "google")).toBe(false);
  });

  it("should reject xAI key with wrong length", () => {
    const invalidKey = "gsk_tooshort";
    expect(validateApiKeyFormat(invalidKey, "xai")).toBe(false);
  });

  it("should reject empty string", () => {
    expect(validateApiKeyFormat("", "openai")).toBe(false);
  });

  it("should reject key with special characters where not allowed", () => {
    const invalidKey = "sk-abc!@#$%^&*()defghijklmnopqrst";
    expect(validateApiKeyFormat(invalidKey, "openai")).toBe(false);
  });
});
