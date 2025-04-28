"use client";

import { MODEL_CONFIGS } from "../../constants/models";
import { ModelType } from "../../hooks/useModelProvider";
import { useState } from "react";
import ModelLogo from "./ModelLogo";

interface ModelSelectorProps {
  label: string;
  value: ModelType;
  onChange: (value: ModelType) => void;
  disabled?: boolean;
}

export default function ModelSelector({
  label,
  value,
  onChange,
  disabled = false,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonId = `model-selector-button-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const labelId = `model-selector-label-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const listboxId = `model-selector-listbox-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const getLabelColor = (label: string) => {
    if (label === "For") return "text-blue-800 dark:text-blue-300";
    if (label === "Against") return "text-red-800 dark:text-red-300";
    return "text-gray-700 dark:text-gray-300";
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg blur-sm group-hover:blur transition-all duration-300 -z-10" />
      <label
        id={labelId}
        className={`relative block text-sm font-medium mb-2 ${getLabelColor(label)}`}
      >
        {label}
      </label>
      <button
        id={buttonId}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`relative w-full px-4 py-2 text-left bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm flex items-center justify-between transition-all duration-300
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                        : "hover:bg-white/90 dark:hover:bg-gray-800/90 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${buttonId}`}
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <ModelLogo modelId={value} />
          {MODEL_CONFIGS[value].name}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          className="absolute z-[100] w-full mt-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
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
              className={`w-full px-3 py-2 text-left hover:bg-blue-50/50 dark:hover:bg-blue-900/20 focus:outline-none focus:bg-blue-50/50 dark:focus:bg-blue-900/20 flex items-center gap-3 transition-colors duration-200
                ${id === value ? "bg-blue-50 dark:bg-blue-900/30" : ""}
                ${id === value ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-100"}`}
            >
              <ModelLogo
                modelId={id as ModelType}
                className="w-5 h-5 flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{config.name}</span>
                <span
                  className={`text-xs ${id === value ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
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
