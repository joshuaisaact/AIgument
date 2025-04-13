import { ReactNode } from 'react';
import { ModelType } from '../hooks/useModelProvider';
import { MODEL_CONFIGS } from '../constants/debate';

interface DebaterResponseProps {
  position: 'For' | 'Against';
  model: ModelType;
  children: ReactNode;
}

export default function DebaterResponse({ position, model, children }: DebaterResponseProps) {
  const modelConfig = MODEL_CONFIGS[model];

  return (
    <div className={`flex ${position === 'For' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${position === 'For' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'} p-4 rounded-lg`}>
        <div className={`font-medium ${position === 'For' ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'} mb-2 flex items-center gap-2`}>
          <span>{position}</span>
          <span className="flex items-center gap-1">
            (<span className="flex items-center gap-1">
              <img src={modelConfig.logo} alt={modelConfig.alt} className="h-4 w-4" />
              {modelConfig.name}
            </span>)
          </span>
        </div>
        <p className="text-gray-800 dark:text-gray-200">{children}</p>
      </div>
    </div>
  );
}