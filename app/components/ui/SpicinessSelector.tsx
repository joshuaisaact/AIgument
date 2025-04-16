"use client";

import { SPICINESS_CONFIGS, SpicinessLevel } from '../../constants/spiciness';
import { Flame } from 'lucide-react';

interface SpicinessSelectorProps {
  value: SpicinessLevel;
  onChange: (value: SpicinessLevel) => void;
  className?: string;
}

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
        {(Object.entries(SPICINESS_CONFIGS) as [SpicinessLevel, typeof SPICINESS_CONFIGS[SpicinessLevel]][]).map(([levelValue, config]) => (
          <button
            key={levelValue}
            role="radio"
            aria-checked={value === levelValue}
            onClick={() => onChange(levelValue)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              value === levelValue
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            title={config.level_descriptor}
          >
            <span className="h-5 flex items-center justify-center">
              {levelValue === 'hot' ? (
                <div className="flex items-center justify-center">
                  <Flame width={18} height={18} />
                  <Flame width={18} height={18} className="ml-0.5"/>
                </div>
              ) : levelValue === 'extra-hot' ? (
                <div className="flex items-center justify-center">
                  <Flame width={18} height={18} />
                  <Flame width={18} height={18} className="ml-0.5"/>
                  <Flame width={18} height={18} className="ml-0.5"/>
                </div>
              ) : (
                <config.Icon width={18} height={18} />
              )}
            </span>
            <span>{config.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}