"use client";

import { useState } from 'react';
import { ModelType } from '../hooks/useModelProvider';
import { MODEL_CONFIGS } from '../constants/debate';

interface ModelSelectorProps {
  label: string;
  value: ModelType;
  onChange: (value: ModelType) => void;
  otherSelected: ModelType;
}

export default function ModelSelector({
  label,
  value,
  onChange,
  otherSelected,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center gap-2 text-gray-700 dark:text-gray-300"
      >
        <img src={MODEL_CONFIGS[value].logo} alt={MODEL_CONFIGS[value].alt} className="h-4 w-4" />
        {MODEL_CONFIGS[value].name}
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {Object.entries(MODEL_CONFIGS).map(([id, config]) => (
            <button
              key={id}
              onClick={() => {
                onChange(id as ModelType);
                setIsOpen(false);
              }}
              disabled={id === otherSelected}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-2
                ${id === value ? 'bg-blue-50 dark:bg-blue-900' : ''}
                ${id === otherSelected ? 'opacity-50 cursor-not-allowed' : ''}
                ${id === value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <img src={config.logo} alt={config.alt} className="h-4 w-4" />
              {config.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
