import { ModelType } from '../hooks/useModelProvider';
import { PERSONALITY_CONFIGS, PersonalityId } from './personalities';
import { SPICINESS_CONFIGS, SpicinessLevel } from './spiciness';


export const DEBATE_PROMPTS = {
  getSystemPrompt: (
    topic: string,
    position: 'PRO' | 'CON',
    previousArguments: string,
    personalityId: PersonalityId = 'standard',
    spiciness: SpicinessLevel = 'medium',
    roundNumber: number = 1
  ) => {
    const personalityConfig = PERSONALITY_CONFIGS[personalityId];
    const spicinessConfig = SPICINESS_CONFIGS[spiciness];
    // Intensity still ramps slightly with rounds, but base is set by spiciness
    const intensityDescriptor = spicinessConfig.level_descriptor;

    // Core Debater Role
    const coreInstructions = `
**Your Role:** You are a debater arguing about: "${topic}".
**Your Stance:** You are arguing passionately for the **${position}** position.
**Debate Style:** This is a **${intensityDescriptor}** debate.
**Round:** ${roundNumber}
**Goal:** Win the argument using the personality and intensity described below. Outshine your opponent!
    `;

    // Format optional lists for the prompt
    const specificInstructionsList = personalityConfig.specific_instructions ? `\n    *   **Specific Directives:** ${personalityConfig.specific_instructions.map(instr => `\n        *   ${instr}`).join('')}` : '';
    const catchphrasesList = personalityConfig.catchphrases ? `\n    *   **Potential Catchphrases (use naturally):** ${personalityConfig.catchphrases.join(', ')}` : '';

    // Personality & Style Instructions
    const personalityInstructions = `
**Your Assigned Personality: ${personalityConfig.name}**
*   **Base Tone:** ${personalityConfig.tone}
*   **Base Style:** ${personalityConfig.style}
*   **Base Humor:** ${personalityConfig.humor}${specificInstructionsList}${catchphrasesList}

**Intensity & Application (${spiciness}):**
*   **Argument Approach:** ${spicinessConfig.argument_modifier}
*   **Humor Application:** ${spicinessConfig.humor_modifier}
*   **Response Style:** ${spicinessConfig.response_style}
*   **Key Tactics:**
    *   Support points with *some* reasoning (even if flimsy at higher intensity).
    *   Keep it engaging and dynamic, matching the personality and intensity.
    *   Be relatively concise (under 150 words ideally).
    *   Address the opponent's *latest* points directly (in character, matching response style).
    *   Introduce *new* angles or examples if possible; **avoid repeating arguments you've already made.**
    *   Maintain your ${position} stance consistently.
    `;

    // Context & Task
    let contextInstructions;
    if (previousArguments) {
      contextInstructions = `
**Previous Arguments (Opponent might be included):**
---
${previousArguments}
---
**Your Task:** Respond to the opponent's *latest* arguments in the style of **${personalityConfig.name}**, applying the **${intensityDescriptor}** intensity. **Introduce a fresh perspective, counter-argument, or example.** Refute, mock, or engage based on your assigned response style. **Do not just repeat your previous points.**
      `;
    } else {
      // Opening Round
      const openingLines = [
        `Deliver your opening argument for the ${position} position as **${personalityConfig.name}** in this **${intensityDescriptor}** debate. Start with a bold claim in character!`, `Kick off the debate for the ${position} side in the persona of **${personalityConfig.name}**, matching the **${intensityDescriptor}** level. Open with a witty, character-fitting observation.`, `Present your initial case for ${position}, embodying **${personalityConfig.name}** at a **${intensityDescriptor}** intensity. Begin by humorously outlining your main points or challenging an assumption.`, `It's your turn to open for the ${position} stance as **${personalityConfig.name}**, setting the **${intensityDescriptor}** tone. Start with a surprising or funny anecdote relevant to the character.`
      ];
      const randomIndex = Math.floor(Math.random() * openingLines.length);
      contextInstructions = `
**Your Task:** ${openingLines[randomIndex]}
      `;
    }

    // Final Prompt Assembly
    return `${coreInstructions}
${personalityInstructions}
${contextInstructions}
**REMEMBER:** Embody the **${personalityConfig.name}** personality at the **${intensityDescriptor}** level. Be funny, stick to your stance (${position}), avoid repetition, and keep it under 150 words. Now, debate!`;
  }
};

export const MODEL_CONFIGS: Record<ModelType, { name: string; logo: string; alt: string; description: string; }> = {
  gpt4o: {
    name: 'ChatGPT-4 Omni',
    logo: '/openai.svg',
    alt: 'ChatGPT-4 Omni',
    description: 'OpenAI\'s latest flagship model.'
  },
  gpt4: {
    name: 'ChatGPT-4 Turbo',
    logo: '/openai.svg',
    alt: 'ChatGPT-4 Turbo (latest)',
    description: 'OpenAI\'s most capable model.'
  },
  gpt35: {
    name: 'ChatGPT-3.5 Turbo',
    logo: '/openai.svg',
    alt: 'ChatGPT-3.5 Turbo (latest)',
    description: 'Fast and affordable model.'
  },
  'claude-sonnet': {
    name: 'Claude 3.7 Sonnet',
    logo: '/anthropic.svg',
    alt: 'Claude 3.7 Sonnet (latest)',
    description: 'Anthropic\'s latest powerful model.'
  },
  'claude-haiku': {
    name: 'Claude 3.5 Haiku',
    logo: '/anthropic.svg',
    alt: 'Claude 3.5 Haiku (latest)',
    description: 'Anthropic\'s fastest, compact model.'
  },
  'gemini-flash': {
    name: 'Gemini 2.0 Flash',
    logo: '/google.svg',
    alt: 'Gemini 1.5 Flash',
    description: 'Google\'s fast multimodal model.'
  },
  'gemini-pro': {
    name: 'Gemini 2.5 Pro',
    logo: '/google.svg',
    alt: 'Gemini 1.5 Pro',
    description: 'Google\'s latest capable model.'
  }
};