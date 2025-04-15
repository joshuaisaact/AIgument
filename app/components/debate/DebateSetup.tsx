"use client";

import DebateControls from './DebateControls';
import { useState } from 'react';
import { ModelType } from '../../hooks/useModelProvider';
import { useRouter } from 'next/navigation';

export function DebateSetup() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [proModel, setProModel] = useState<ModelType>('gpt4');
  const [conModel, setConModel] = useState<ModelType>('gpt4');
  const [isPending, startTransition] = useState(false);

  const handleStartDebate = () => {
    if (topic.trim()) {
      startTransition(true);
      const params = new URLSearchParams({
        topic,
        proModel,
        conModel,
      });
      router.push(`/debate?${params.toString()}`);
    }
  };

  return (
    <DebateControls
      topic={topic}
      setTopic={setTopic}
      proModel={proModel}
      setProModel={setProModel}
      conModel={conModel}
      setConModel={setConModel}
      onStartDebate={handleStartDebate}
      isPending={isPending}
    />
  );
}