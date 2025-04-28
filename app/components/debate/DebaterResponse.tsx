import React from 'react';
import { MODEL_CONFIGS } from '../../constants/models';
import { ModelType } from '../../hooks/useModelProvider';
import { ReactNode } from 'react';
import ModelLogo from '../ui/ModelLogo';
import { PersonalityId } from '../../constants';

interface DebaterResponseProps {
  position: 'For' | 'Against';
  model: ModelType;
  personality: PersonalityId;
  children: ReactNode;
}

export default function DebaterResponse({ position, model, personality, children }: DebaterResponseProps) {
  const headerId = `response-header-${position}-${model}`;

  // Convert asterisks to bold text
  const formatText = (text: string) => {
    return text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  };

  // Get font class based on personality
  const getFontClass = (personality: PersonalityId) => {
    switch (personality) {
      case 'alfred_butler':
      case 'passive_aggressive':
      case 'eccentric_aristocrat':
      case 'royal_highness':
        return 'font-professional';
      case 'pirate':
        return 'font-pirate';
      case 'noir_detective':
        return 'font-noir';
      case 'shakespearean_actor':
        return 'font-shakespeare';
      case 'kids_tv_presenter':
        return 'font-kids';
      case 'punslinger':
        return 'font-puns';
      case 'gaming_enthusiast':
        return 'font-gaming';
      case 'emo_teen':
        return 'font-emo';
      default:
        return 'font-sans';
    }
  };

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
        <div
          className={`text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap ${getFontClass(personality)}`}
          dangerouslySetInnerHTML={{ __html: formatText(String(children)) }}
        />
      </div>
    </article>
  );
}