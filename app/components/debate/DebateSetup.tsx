"use client";

import { DebateControls } from './DebateControls';
import { useState, Suspense } from 'react';
import { ModelType } from '../../hooks/useModelProvider';
import { useRouter } from 'next/navigation';

export function DebateSetup() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [proModel, setProModel] = useState<ModelType>('gpt4');
  const [conModel, setConModel] = useState<ModelType>('gpt4');

  const handleStartDebate = () => {
    if (topic.trim()) {
      const params = new URLSearchParams({
        topic,
        proModel,
        conModel,
      });
      router.push(`/debate?${params.toString()}`);
    }
  };

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <DebateControls
        topic={topic}
        setTopic={setTopic}
        proModel={proModel}
        setProModel={setProModel}
        conModel={conModel}
        setConModel={setConModel}
        onStartDebate={handleStartDebate}
      />
    </Suspense>
  );
}