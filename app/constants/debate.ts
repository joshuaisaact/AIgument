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

    // Determine the goal instruction based on potential override
    const goalInstruction = personalityConfig.goal_override
      ? personalityConfig.goal_override // Use override if present
      : `Goal: Win the argument using the personality and intensity described below. Outshine your opponent!`; // Default goal

    // Core Debater Role
    const coreInstructions = `
**Your Role:** You are a debater arguing about: "${topic}".
**Your Stance:** You are arguing passionately for the **${position}** position.
**Debate Style:** This is a **${intensityDescriptor}** debate.
**Round:** ${roundNumber}
**${goalInstruction}**
    `;

    // Format optional lists for the prompt
    const specificInstructionsList = personalityConfig.specific_instructions ? `\n    *   **Specific Directives:** ${personalityConfig.specific_instructions.map(instr => `\n        *   ${instr}`).join('')}` : '';
    const catchphrasesList = personalityConfig.catchphrases ? `\n    *   **Optional Phrases (use sparingly & only if fitting):** ${personalityConfig.catchphrases.join(', ')}` : '';

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
    *   **Avoid excessive repetition of the same catchphrases or stylistic mannerisms.**
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
**REMEMBER:** Embody the **${personalityConfig.name}** personality at the **${intensityDescriptor}** level. Be funny, stick to your stance (${position}), avoid repeating arguments AND stylistic phrases, and keep it under 150 words. **Crucially, AVOID overly polite or deferential language ('my dear opponent', 'with all due respect', 'friend', etc.) especially at higher intensity levels (Hot, Extra Hot). Match the specified tone and response style DIRECTLY.** Now, debate!`;
  }
};