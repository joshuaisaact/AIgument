"use client";

export type SpicinessLevel = "lemon" | "mild" | "medium" | "hot" | "extra-hot";

interface SpicinessSelectorProps {
  value: SpicinessLevel;
  onChange: (value: SpicinessLevel) => void;
  className?: string;
}

const SPICINESS_LEVELS: { value: SpicinessLevel; label: string; description: string }[] = [
  {
    value: "lemon",
    label: "Lemon & Herb",
    description: "Gentle and diplomatic debate style"
  },
  {
    value: "mild",
    label: "Mild",
    description: "Respectful but firm arguments"
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced mix of diplomacy and directness"
  },
  {
    value: "hot",
    label: "Hot",
    description: "More aggressive and confrontational"
  },
  {
    value: "extra-hot",
    label: "Extra Hot",
    description: "Maximum intensity with strong rhetoric"
  }
];

export function SpicinessSelector({ value, onChange, className = "" }: SpicinessSelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Debate Intensity
      </label>
      <div className="grid grid-cols-5 gap-2">
        {SPICINESS_LEVELS.map((level) => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`p-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              value === level.value
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            title={level.description}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}