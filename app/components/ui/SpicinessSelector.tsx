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

  const getIconColor = (level: SpicinessLevel) => {
    switch (level) {
      case 'lemon':
        return 'text-lime-500 dark:text-lime-400';
      case 'mild':
        return 'text-blue-500 dark:text-blue-400';
      case 'medium':
        return 'text-orange-500 dark:text-orange-400';
      case 'hot':
        return 'text-orange-500 dark:text-orange-400';
      case 'extra-hot':
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className={`space-y-2 group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg blur-sm group-hover:blur transition-all duration-300 -z-10" />
      <label
        id={labelId}
        className="relative block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Debate Intensity
      </label>
      <div
        className="grid grid-cols-5 gap-2 relative"
        role="radiogroup"
        aria-labelledby={labelId}
      >
        {(Object.entries(SPICINESS_CONFIGS) as [SpicinessLevel, typeof SPICINESS_CONFIGS[SpicinessLevel]][]).map(([levelValue, config]) => (
          <button
            key={levelValue}
            role="radio"
            aria-checked={value === levelValue}
            onClick={() => onChange(levelValue)}
            className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 backdrop-blur-sm
              ${
                value === levelValue
                  ? "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100/90 dark:hover:bg-blue-900/40"
                  : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700/80"
              }`}
            title={config.level_descriptor}
          >
            <span className="h-5 flex items-center justify-center">
              {levelValue === 'hot' ? (
                <div className="flex items-center justify-center">
                  <Flame width={18} height={18} className="text-orange-500 dark:text-orange-400" />
                  <Flame width={18} height={18} className="ml-0.5 text-orange-500 dark:text-orange-400" />
                </div>
              ) : levelValue === 'extra-hot' ? (
                <div className="flex items-center justify-center">
                  <Flame width={18} height={18} className="text-red-500 dark:text-red-400" />
                  <Flame width={18} height={18} className="ml-0.5 text-red-500 dark:text-red-400" />
                  <Flame width={18} height={18} className="ml-0.5 text-red-500 dark:text-red-400" />
                </div>
              ) : (
                <config.Icon width={18} height={18} className={getIconColor(levelValue)} />
              )}
            </span>
            <span>{config.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}