"use client";

import { useState } from 'react';
import ModelSelector from '../ui/ModelSelector';
import TopicInput from '../ui/TopicInput';
import DebateArena from './DebateArena';
import { ModelType } from '../../hooks/useModelProvider';

export function DebateControls() {
  const [topic, setTopic] = useState('');
  const [debater1, setDebater1] = useState<ModelType>('gpt4');
  const [debater2, setDebater2] = useState<ModelType>('claude-sonnet');
  const [isDebateStarted, setIsDebateStarted] = useState(false);

  const startDebate = () => {
    if (topic.trim()) {
      setIsDebateStarted(true);
    }
  };

  const resetDebate = () => {
    setIsDebateStarted(false);
  };

  if (!isDebateStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
        <div className="w-full space-y-8">
          <TopicInput value={topic} onChange={setTopic} />

          <div className="flex justify-center">
            <button
              onClick={startDebate}
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
                value={debater1}
                onChange={setDebater1}
                otherSelected={debater2}
              />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <ModelSelector
                label="Against"
                value={debater2}
                onChange={setDebater2}
                otherSelected={debater1}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <DebateArena
        topic={topic}
        debater1={debater1}
        debater2={debater2}
        onReset={resetDebate}
      />
    </div>
  );
}