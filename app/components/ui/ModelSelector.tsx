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

  return (
    <div className="relative">
      <label id={labelId} className="mb-1.5 block text-sm font-medium text-ink-muted">
        {label}
      </label>
      <button
        id={buttonId}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-md border border-rule bg-surface px-3 py-2 text-left transition-colors
                    ${
                      disabled
                        ? "cursor-not-allowed text-ink-muted opacity-60"
                        : "hover:border-rule-strong focus:border-ink focus:outline-none"
                    }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${buttonId}`}
      >
        <div className="flex items-center gap-2 text-ink">
          <ModelLogo modelId={value} />
          {MODEL_CONFIGS[value].name}
        </div>
        <svg
          className={`h-4 w-4 text-ink-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
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
          className="absolute z-100 mt-1 w-full divide-y divide-rule border border-rule-strong bg-surface"
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
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-sunken focus:bg-surface-sunken focus:outline-none
                ${id === value ? "bg-surface-sunken text-ink" : "text-ink"}`}
            >
              <ModelLogo
                modelId={id as ModelType}
                className="w-5 h-5 flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm">{config.name}</span>
                <span
                  className="text-xs text-ink-muted"
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
