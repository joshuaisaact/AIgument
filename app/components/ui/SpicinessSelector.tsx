"use client";

import { Citrus, Thermometer, Flame } from 'lucide-react';
import { ReactNode } from 'react';

export type SpicinessLevel = "lemon" | "mild" | "medium" | "hot" | "extra-hot";

interface SpicinessSelectorProps {
  value: SpicinessLevel;
  onChange: (value: SpicinessLevel) => void;
  className?: string;
}

const SPICINESS_LEVELS: { value: SpicinessLevel; label: string; description: string; icon: ReactNode }[] = [
  {
    value: "lemon",
    label: "Lemon & Herb",
    description: "Gentle and diplomatic debate style",
    icon: <Citrus size={18} />
  },
  {
    value: "mild",
    label: "Mild",
    description: "Respectful but firm arguments",
    icon: <Thermometer size={18} />
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced mix of diplomacy and directness",
    icon: <Flame size={18} />
  },
  {
    value: "hot",
    label: "Hot",
    description: "More aggressive and confrontational",
    icon: <div className="flex items-center justify-center"><Flame size={18} /><Flame size={18} className="ml-0.5"/></div>
  },
  {
    value: "extra-hot",
    label: "Extra Hot",
    description: "Maximum intensity with strong rhetoric",
    icon: <div className="flex items-center justify-center">
            <Flame size={18} />
            <Flame size={18} className="ml-0.5"/>
            <Flame size={18} className="ml-0.5"/>
          </div>
  }
];

export function SpicinessSelector({ value, onChange, className = "" }: SpicinessSelectorProps) {
  const labelId = "spiciness-label";

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        id={labelId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Debate Intensity
      </label>
      <div
        className="grid grid-cols-5 gap-2"
        role="radiogroup"
        aria-labelledby={labelId}
      >
        {SPICINESS_LEVELS.map((level) => (
          <button
            key={level.value}
            role="radio"
            aria-checked={value === level.value}
            onClick={() => onChange(level.value)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              value === level.value
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            title={level.description}
          >
            <span className="h-5 flex items-center justify-center">{level.icon}</span>
            <span>{level.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}