import { describe, it, expect } from "vitest";
import { DEBATE_PROMPTS } from "./debate";

const testTopic = "Pineapple on pizza";

describe("getSystemPrompt - happy path", () => {
  it("should generate a basic prompt with default values", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(testTopic, "PRO", "");

    expect(prompt).toContain(testTopic);
    expect(prompt).toContain("PRO");
    expect(prompt).toContain("Standard Debater");
    expect(prompt).toContain("Proper Argument");
  });

  it("should generate prompt for PRO position", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(testTopic, "PRO", "");

    expect(prompt).toContain("PRO");
    expect(prompt).toContain("Win the argument");
  });

  it("should generate prompt for CON position", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(testTopic, "CON", "");

    expect(prompt).toContain("CON");
    expect(prompt).toContain("Win the argument");
  });

  it("should include personality traits for pirate personality", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "pirate",
    );

    expect(prompt).toContain("Cap'n Argument");
  });

  it("should include personality traits for drag queen personality", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "drag_queen",
    );

    expect(prompt).toContain("Sassy Drag Queen");
  });

  it("should adjust intensity for lemon spiciness level", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "standard",
      "lemon",
    );

    expect(prompt).toContain("Calm and Professional");
    expect(prompt).toContain("logical and well-supported");
  });

  it("should adjust intensity for extra-hot spiciness level", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "standard",
      "extra-hot",
    );

    expect(prompt).toContain("Chaotic Roast Battle");
  });

  it("should include round number in prompt", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "standard",
      "medium",
      3,
    );

    expect(prompt).toContain("Round:** 3");
  });
});

describe("getSystemPrompt - with previous arguments", () => {
  it("should include previous arguments context", () => {
    const previousArgs = "Opponent said: Pineapple ruins pizza!";
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      previousArgs,
      "standard",
      "medium",
    );

    expect(prompt).toContain("Previous Arguments");
    expect(prompt).toContain(previousArgs);
    expect(prompt).toContain("Respond to the opponent");
  });

  it("should ask to introduce fresh perspective when there are previous arguments", () => {
    const previousArgs = "Some previous debate content";
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      previousArgs,
    );

    expect(prompt).toContain("fresh perspective");
    expect(prompt).toContain("Do not just repeat your previous points");
  });

  it("should request opening argument when no previous arguments", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(testTopic, "PRO", "");

    expect(prompt).toContain("Your Task:");
    expect(prompt).not.toContain("Previous Arguments");
  });
});

describe("getSystemPrompt - personality and spiciness combinations", () => {
  it("should combine butler personality with lemon spiciness correctly", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "alfred_butler",
      "lemon",
    );

    expect(prompt).toContain("Alfred the Butler");
    expect(prompt).toContain("Calm and Professional");
    expect(prompt).toContain("Formal");
  });

  it("should combine pirate personality with extra-hot spiciness correctly", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "CON",
      "",
      "pirate",
      "extra-hot",
    );

    expect(prompt).toContain("Cap'n Argument");
    expect(prompt).toContain("Chaotic Roast Battle");
  });
});

describe("getSystemPrompt - essential guidelines", () => {
  it("should always include word limit guidance", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(testTopic, "PRO", "");

    expect(prompt).toContain("under 150 words");
  });

  it("should always instruct to avoid repetition", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(testTopic, "PRO", "");

    expect(prompt).toContain("avoid repeating arguments");
    expect(prompt).toContain("Avoid excessive repetition");
  });

  it("should maintain consistent stance throughout", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(testTopic, "CON", "");

    expect(prompt).toContain("Maintain your CON stance consistently");
  });

  it("should warn against overly polite language at high intensity", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "standard",
      "hot",
    );

    expect(prompt).toContain("AVOID overly polite or deferential language");
    expect(prompt).toContain("my dear opponent");
  });
});

describe("getSystemPrompt - structure validation", () => {
  it("should include all major sections in the prompt", () => {
    const prompt = DEBATE_PROMPTS.getSystemPrompt(
      testTopic,
      "PRO",
      "",
      "standard",
      "medium",
      1,
    );

    // Core role section
    expect(prompt).toContain("Your Role:");
    expect(prompt).toContain("Your Stance:");

    // Personality section
    expect(prompt).toContain("Your Assigned Personality:");
    expect(prompt).toContain("Base Tone:");
    expect(prompt).toContain("Base Style:");

    // Intensity section
    expect(prompt).toContain("Intensity & Application");
    expect(prompt).toContain("Argument Approach:");

    // Task section
    expect(prompt).toContain("Your Task:");
  });
});
