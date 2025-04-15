"use client";

import ModelSelector from '../ui/ModelSelector';
import TopicInput from '../ui/TopicInput';
import { ModelType } from '../../hooks/useModelProvider';
import { Button } from '../ui/Button';

interface DebateControlsProps {
  topic: string;
  setTopic: (topic: string) => void;
  proModel: ModelType;
  setProModel: (model: ModelType) => void;
  conModel: ModelType;
  setConModel: (model: ModelType) => void;
  onStartDebate: () => void;
  isPending?: boolean;
}

export default function DebateControls({
  topic,
  setTopic,
  proModel,
  setProModel,
  conModel,
  setConModel,
  onStartDebate,
  isPending = false,
}: DebateControlsProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <TopicInput value={topic} onChange={setTopic} />
      <Button
        onClick={onStartDebate}
        disabled={!topic.trim() || isPending}
        isLoading={isPending}
        className="w-full"
      >
        Start Debate
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ModelSelector
          label="For"
          value={proModel}
          onChange={setProModel}
        />
        <ModelSelector
          label="Against"
          value={conModel}
          onChange={setConModel}
        />
      </div>
    </div>
  );
}