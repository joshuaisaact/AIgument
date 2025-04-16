import React from 'react';
import { MODEL_CONFIGS } from '../../constants/models';
import { ModelType } from '../../hooks/useModelProvider';
import { ReactNode } from 'react';
import ModelLogo from '../ui/ModelLogo';

interface DebaterResponseProps {
  position: 'For' | 'Against';
  model: ModelType;
  children: ReactNode;
}

export default function DebaterResponse({ position, model, children }: DebaterResponseProps) {
  const headerId = `response-header-${position}-${model}`;

  return (
    <article
      className={`flex min-w-[200px] ${position === 'For' ? 'justify-start' : 'justify-end'}`}
      aria-labelledby={headerId}
    >
      <div className={`max-w-[80%] ${position === 'For' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'} p-4 rounded-lg shadow-sm`}>
        <div id={headerId} className="flex items-center justify-between mb-3">
          <div className={`font-semibold ${position === 'For' ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'}`}>
            {position}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ModelLogo modelId={model} className="h-4 w-4" />
            <span>{MODEL_CONFIGS[model].name}</span>
          </div>
        </div>
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </article>
  );
}