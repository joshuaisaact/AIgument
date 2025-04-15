"use client";

import { ModelType } from '../../hooks/useModelProvider';
import { ReactNode } from 'react';
import { MODEL_CONFIGS } from '../../constants/debate';
import Image from 'next/image';

interface DebaterResponseProps {
  position: 'For' | 'Against';
  model: ModelType;
  children: ReactNode;
}

export default function DebaterResponse({ position, model, children }: DebaterResponseProps) {
  const modelConfig = MODEL_CONFIGS[model];

  return (
    <div className={`flex ${position === 'For' ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] ${position === 'For' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'} p-4 rounded-lg shadow-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`font-semibold ${position === 'For' ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'}`}>
            {position}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Image
              src={modelConfig.logo}
              alt={modelConfig.alt}
              width={16}
              height={16}
              className="h-4 w-4 dark:hidden"
            />
            <Image
              src={modelConfig.logo.replace('.svg', '-light.svg')}
              alt={modelConfig.alt}
              width={16}
              height={16}
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