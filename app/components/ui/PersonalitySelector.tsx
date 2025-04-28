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
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg blur-sm group-hover:blur transition-all duration-300 -z-10" />
      <label
        id={labelId}
        className="relative block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
      >
        Personality
      </label>
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full px-4 py-2 text-left bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-white/90 dark:hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center justify-between transition-all duration-300"
        title={selectedPersonality.description}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${buttonId}`}
      >
        <span className="text-gray-700 dark:text-gray-300">
          {selectedPersonality.name}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
          className="absolute z-50 w-full mt-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-90 overflow-y-auto"
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
              className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50/50 dark:hover:bg-blue-900/20 focus:outline-none focus:bg-blue-50/50 dark:focus:bg-blue-900/20 flex flex-col transition-colors duration-200
                ${id === value ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                ${id === value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-100'}`}
              title={config.description}
            >
              <span className="font-medium">{config.name}</span>
              <span className={`text-xs ${id === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>{config.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}