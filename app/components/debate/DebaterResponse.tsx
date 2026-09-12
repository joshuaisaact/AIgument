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

  const isFor = position === 'For';

  return (
    <article
      className="rounded-md border border-rule p-4"
      aria-labelledby={headerId}
    >
      <div id={headerId} className="mb-3 flex items-center justify-between gap-3">
        <span className={`text-sm font-semibold ${isFor ? 'text-pro' : 'text-con'}`}>
          {position}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-ink-muted">
          <ModelLogo modelId={model} className="h-4 w-4" />
          {MODEL_CONFIGS[model].name}
        </span>
      </div>
      <div
        className={`leading-relaxed whitespace-pre-wrap text-ink ${getFontClass(personality)}`}
        dangerouslySetInnerHTML={{ __html: formatText(String(children)) }}
      />
    </article>
  );
}
