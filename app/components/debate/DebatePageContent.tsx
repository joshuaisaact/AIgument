"use client";

import DebateArena from './DebateArena';
import { useSearchParams, useRouter } from 'next/navigation';
import { ModelType } from '../../hooks/useModelProvider';

export function DebatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || '';
  const proModel = (searchParams.get('proModel') as ModelType) || 'gpt4';
  const conModel = (searchParams.get('conModel') as ModelType) || 'gpt4';

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <p className="text-xl text-gray-600 dark:text-gray-300">No debate topic provided</p>
      </div>
    );
  }

  return (
    <DebateArena
      topic={topic}
      debater1={proModel}
      debater2={conModel}
      onReset={() => router.push('/')}
    />
  );
}