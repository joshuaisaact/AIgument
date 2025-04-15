"use client";

import DebateControls from './DebateControls';
import { useState } from 'react';
import { ModelType } from '../../hooks/useModelProvider';
import { useRouter } from 'next/navigation';
import { SpicinessLevel } from '../ui/SpicinessSelector';

export function DebateSetup() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [proModel, setProModel] = useState<ModelType>('gpt4');
  const [conModel, setConModel] = useState<ModelType>('gpt4');
  const [spiciness, setSpiciness] = useState<SpicinessLevel>('medium');
  const [isPending, setIsPending] = useState(false);

  const handleStartDebate = () => {
    if (topic.trim()) {
      setIsPending(true);
      const params = new URLSearchParams({
        topic,
        proModel,
        conModel,
        spiciness,
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
      spiciness={spiciness}
      setSpiciness={setSpiciness}
      onStartDebate={handleStartDebate}
      isPending={isPending}
    />
  );
}