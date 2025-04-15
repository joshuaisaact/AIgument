"use client";

import DebateControls, { DebaterConfig } from './DebateControls';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpicinessLevel } from '../../constants/spiciness';

export function DebateSetup() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [debater1Config, setDebater1Config] = useState<DebaterConfig>({
    model: 'gpt4',
    personality: 'standard',
  });
  const [debater2Config, setDebater2Config] = useState<DebaterConfig>({
    model: 'claude-sonnet',
    personality: 'standard',
  });
  const [spiciness, setSpiciness] = useState<SpicinessLevel>('medium');
  const [isPending, setIsPending] = useState(false);

  const handleStartDebate = () => {
    if (topic.trim()) {
      setIsPending(true);
      const params = new URLSearchParams({
        topic,
        model1: debater1Config.model,
        personality1: debater1Config.personality,
        model2: debater2Config.model,
        personality2: debater2Config.personality,
        spiciness,
      });
      router.push(`/debate?${params.toString()}`);
    }
  };

  return (
    <DebateControls
      topic={topic}
      setTopic={setTopic}
      debater1Config={debater1Config}
      setDebater1Config={setDebater1Config}
      debater2Config={debater2Config}
      setDebater2Config={setDebater2Config}
      spiciness={spiciness}
      setSpiciness={setSpiciness}
      onStartDebate={handleStartDebate}
      isPending={isPending}
    />
  );
}