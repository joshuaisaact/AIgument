"use client";

import { useState } from 'react';

type Model = "claude" | "gpt4" | "gpt35" | "gemini";

interface ModelSelectorProps {
  label: string;
  value: Model;
  onChange: (value: Model) => void;
  otherSelected: Model;
}

export default function ModelSelector({
  label,
  value,
  onChange,
  otherSelected,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const models: { id: Model; name: string }[] = [
    { id: "claude", name: "Claude" },
    { id: "gpt4", name: "GPT-4" },
    { id: "gpt35", name: "GPT-3.5" },
    { id: "gemini", name: "Gemini" },
  ];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        {models.find((m) => m.id === value)?.name}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onChange(model.id);
                setIsOpen(false);
              }}
              disabled={model.id === otherSelected}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700
                ${model.id === value ? 'bg-blue-50 dark:bg-blue-900' : ''}
                ${model.id === otherSelected ? 'opacity-50 cursor-not-allowed' : ''}
                ${model.id === value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
            >
              {model.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
