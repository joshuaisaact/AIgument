"use client";

import DebateArena from './DebateArena';
import { useSearchParams, useRouter } from 'next/navigation';
import { ModelType } from '../../hooks/useModelProvider';
import { SpicinessLevel } from '../../constants/spiciness';
import { PersonalityId } from '@/app/constants';

export function DebatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const topic = searchParams.get('topic') || '';
  const model1 = (searchParams.get('model1') as ModelType) || 'gpt-6-astra';
  const personality1 = (searchParams.get('personality1') as PersonalityId) || 'standard';
  const model2 = (searchParams.get('model2') as ModelType) || 'claude-opus-5';
  const personality2 = (searchParams.get('personality2') as PersonalityId) || 'standard';
  const spiciness = (searchParams.get('spiciness') as SpicinessLevel) || 'medium';

  if (!topic) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-xl text-ink-muted">No debate topic provided.</p>
      </div>
    );
  }

  return (
    <DebateArena
      topic={topic}
      debater1Model={model1}
      debater1Personality={personality1}
      debater2Model={model2}
      debater2Personality={personality2}
      spiciness={spiciness}
      onReset={() => router.push('/')}
    />
  );
}