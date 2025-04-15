import { Citrus, Thermometer, Flame } from 'lucide-react';

export type SpicinessLevel = 'lemon' | 'mild' | 'medium' | 'hot' | 'extra-hot';

interface SpicinessConfig {
  name: string; // User-friendly name (e.g., "Medium")
  Icon: React.FC<React.SVGProps<SVGSVGElement>>; // Icon component
  level_descriptor: string; // Adjective for the intensity
  argument_modifier: string; // How to approach arguments based on intensity
  humor_modifier: string; // How to apply humor based on intensity
  response_style: string; // How to react to opponent based on intensity
}

// Defines how spiciness modifies the debate tone
export const SPICINESS_CONFIGS: Record<SpicinessLevel, SpicinessConfig> = {
  lemon: {
    name: "Lemon & Herb",
    Icon: Citrus,
    level_descriptor: "Calm and Professional",
    argument_modifier: "Keep arguments logical and well-supported. Prioritize clarity.",
    humor_modifier: "Use the personality's humor sparingly and subtly, if at all.",
    response_style: "Address opponent's points politely and directly, focusing on substance.",
  },
  mild: {
    name: "Mild",
    Icon: Thermometer,
    level_descriptor: "Spirited Discussion",
    argument_modifier: "Use relatable examples, stay mostly grounded but allow personality flair.",
    humor_modifier: "Incorporate the personality's humor with lighthearted quips and gentle teasing.",
    response_style: "Respond respectfully but firmly, perhaps with mild character-based jabs.",
  },
  medium: {
    name: "Medium",
    Icon: Flame,
    level_descriptor: "Proper Argument",
    argument_modifier: "Employ sarcasm and rhetoric effectively. Bend logic slightly for comedic/argumentative effect if it fits the character.",
    humor_modifier: "Lean into the personality's humor style with noticeable sarcasm and witty remarks.",
    response_style: "Directly challenge or mock opponent's weaker points using the character's voice.",
  },
  hot: {
    name: "Hot",
    // For multi-icon, we might need a wrapper or handle it in the display component
    // For simplicity here, just using Flame. Consider revising if exact multi-flame needed everywhere.
    Icon: Flame,
    level_descriptor: "Heated Exchange",
    argument_modifier: "Use strong metaphors, bold claims. Don't shy away from fallacies if they serve the character and the heat.",
    humor_modifier: "Utilize the personality's humor aggressively: cutting sarcasm, ridicule, hyperbole.",
    response_style: "Aggressively confront and try to dismantle opponent's points in character.",
  },
  "extra-hot": {
    name: "Extra Hot",
    // Same note as 'hot' regarding multiple icons.
    Icon: Flame,
    level_descriptor: "Chaotic Roast Battle",
    argument_modifier: "Embrace absurdity, personal jabs (SFW!), and dramatic flair. Logic is secondary to entertainment and character portrayal.",
    humor_modifier: "Go for maximum snark, bordering on a roast. Make it entertainingly chaotic in the personality's style.",
    response_style: "Ruthlessly mock, derail, or ignore opponent's points for comedic effect, staying true to the character.",
  }
};