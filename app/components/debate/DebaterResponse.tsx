"use client";

import { ModelType } from '../../hooks/useModelProvider';
import { ReactNode } from 'react';
import { MODEL_CONFIGS } from '../../constants/debate';

interface DebaterResponseProps {
  position: 'For' | 'Against';
  model: ModelType;
  children: ReactNode;
}

export default function DebaterResponse({ position, model, children }: DebaterResponseProps) {
  const modelConfig = MODEL_CONFIGS[model];

  return (
    <div className={`flex ${position === 'For' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${position === 'For' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'} p-4 rounded-lg shadow-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`font-semibold ${position === 'For' ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'}`}>
            {position}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <img
              src={modelConfig.logo}
              alt={modelConfig.alt}
              className="h-4 w-4 dark:hidden"
            />
            <img
              src={modelConfig.logo.replace('.svg', '-light.svg')}
              alt={modelConfig.alt}
              className="h-4 w-4 hidden dark:block"
            />
            <span>{modelConfig.name}</span>
          </div>
        </div>
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}