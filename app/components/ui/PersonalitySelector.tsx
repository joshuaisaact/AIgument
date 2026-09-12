"use client";

import { PERSONALITY_CONFIGS, PersonalityId } from '@/app/constants';
import { useState } from 'react';

interface PersonalitySelectorProps {
  label: string;
  value: PersonalityId;
  onChange: (value: PersonalityId) => void;
}

export default function PersonalitySelector({
  label,
  value,
  onChange,
}: PersonalitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonId = `personality-selector-button-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const labelId = `personality-selector-label-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const listboxId = `personality-selector-listbox-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const selectedPersonality = PERSONALITY_CONFIGS[value];

  return (
    <div className="relative">
      <label id={labelId} className="mb-1.5 block text-sm font-medium text-ink-muted">
        Personality
      </label>
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-rule bg-surface px-3 py-2 text-left transition-colors hover:border-rule-strong focus:border-ink focus:outline-none"
        title={selectedPersonality.description}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${buttonId}`}
      >
        <span className="text-ink">{selectedPersonality.name}</span>
        <svg
          className={`h-4 w-4 text-ink-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute z-50 mt-1 max-h-90 w-full divide-y divide-rule overflow-y-auto border border-rule-strong bg-surface"
        >
          {Object.entries(PERSONALITY_CONFIGS).map(([id, config]) => (
            <button
              key={id}
              role="option"
              aria-selected={id === value}
              type="button"
              onClick={() => {
                onChange(id as PersonalityId);
                setIsOpen(false);
              }}
              className={`flex w-full flex-col px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-sunken focus:bg-surface-sunken focus:outline-none
                ${id === value ? 'bg-surface-sunken' : ''}`}
              title={config.description}
            >
              <span className="font-medium">{config.name}</span>
              <span className="text-xs text-ink-muted">{config.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}