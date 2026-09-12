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
      <label id={labelId} className="mb-1.5 block text-sm font-medium text-ink-muted">
        Intensity
      </label>
      <div
        className="grid grid-cols-5 divide-x divide-rule border border-rule"
        role="radiogroup"
        aria-labelledby={labelId}
      >
        {(Object.entries(SPICINESS_CONFIGS) as [SpicinessLevel, typeof SPICINESS_CONFIGS[SpicinessLevel]][]).map(([levelValue, config]) => (
          <button
            key={levelValue}
            role="radio"
            aria-checked={value === levelValue}
            onClick={() => onChange(levelValue)}
            className={`flex flex-col items-center gap-1.5 px-1 py-2.5 text-xs transition-colors focus:outline-none
              ${
                value === levelValue
                  ? "bg-ink text-surface"
                  : "bg-surface text-ink-muted hover:bg-surface-sunken"
              }`}
            title={config.level_descriptor}
          >
            <span className="flex h-4 items-center justify-center">
              {levelValue === 'hot' || levelValue === 'extra-hot' ? (
                <div className="flex items-center justify-center gap-0.5">
                  {Array.from({ length: levelValue === 'hot' ? 2 : 3 }).map((_, i) => (
                    <Flame key={i} width={15} height={15} />
                  ))}
                </div>
              ) : (
                <config.Icon width={15} height={15} />
              )}
            </span>
            <span className="tracking-wide">{config.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}