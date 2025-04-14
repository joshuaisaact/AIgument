"use client";

import ModelSelector from '../ui/ModelSelector';
import TopicInput from '../ui/TopicInput';
import { ModelType } from '../../hooks/useModelProvider';

interface DebateControlsProps {
  topic: string;
  setTopic: (topic: string) => void;
  proModel: ModelType;
  setProModel: (model: ModelType) => void;
  conModel: ModelType;
  setConModel: (model: ModelType) => void;
  onStartDebate: () => void;
}

export function DebateControls({
  topic,
  setTopic,
  proModel,
  setProModel,
  conModel,
  setConModel,
  onStartDebate,
}: DebateControlsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
      <div className="w-full space-y-8">
        <TopicInput value={topic} onChange={setTopic} />

        <div className="flex justify-center">
          <button
            onClick={onStartDebate}
            disabled={!topic.trim()}
            className={`px-6 py-3 rounded-lg font-medium text-white
              bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600
              dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700
              transform hover:scale-105 transition-all duration-200
              ${!topic.trim() ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
          >
            Start Debate
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <ModelSelector
              label="For"
              value={proModel}
              onChange={setProModel}
            />
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <ModelSelector
              label="Against"
              value={conModel}
              onChange={setConModel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}