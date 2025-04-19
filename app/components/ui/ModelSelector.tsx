"use client";

import { MODEL_CONFIGS } from '../../constants/models';
import { ModelType } from '../../hooks/useModelProvider';
import { useState } from 'react';
import ModelLogo from './ModelLogo';

interface ModelSelectorProps {
  label: string;
  value: ModelType;
  onChange: (value: ModelType) => void;
}

export default function ModelSelector({
  label,
  value,
  onChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonId = `model-selector-button-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const labelId = `model-selector-label-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const listboxId = `model-selector-listbox-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const getLabelColor = (label: string) => {
    if (label === 'For') return 'text-blue-800 dark:text-blue-300';
    if (label === 'Against') return 'text-red-800 dark:text-red-300';
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="relative">
      <label
        id={labelId}
        className={`block text-sm font-medium mb-2 ${getLabelColor(label)}`}
      >
        {label}
      </label>
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${buttonId}`}
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <ModelLogo modelId={value} />
          {MODEL_CONFIGS[value].name}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
          className="absolute z-[100] w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
        >
          {Object.entries(MODEL_CONFIGS).map(([id, config]) => (
            <button
              key={id}
              role="option"
              aria-selected={id === value}
              type="button"
              onClick={() => {
                onChange(id as ModelType);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-3
                ${id === value ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                ${id === value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-100'}`}
            >
              <ModelLogo modelId={id as ModelType} className="w-5 h-5 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{config.name}</span>
                <span
                  className={`text-xs ${id === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                  dangerouslySetInnerHTML={{ __html: config.description }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}