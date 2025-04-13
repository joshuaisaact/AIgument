"use client";

import { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import TopicInput from './components/TopicInput';
import DebateArena from './components/DebateArena';

type Model = "claude" | "gpt4" | "gpt35" | "gemini";

export default function Page() {
  const [topic, setTopic] = useState('');
  const [debater1, setDebater1] = useState<Model>('gpt4');
  const [debater2, setDebater2] = useState<Model>('claude');
  const [isDebateStarted, setIsDebateStarted] = useState(false);

  const startDebate = () => {
    if (topic.trim()) {
      setIsDebateStarted(true);
    }
  };

  const resetDebate = () => {
    setIsDebateStarted(false);
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      {!isDebateStarted ? (
        <div className="flex flex-col items-center justify-center h-full gap-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to the Argument Room</h1>

          <TopicInput value={topic} onChange={setTopic} />

          <div className="grid grid-cols-2 gap-8 w-full">
            <ModelSelector
              label="Debater 1 (PRO)"
              value={debater1}
              onChange={setDebater1}
              otherSelected={debater2}
            />
            <ModelSelector
              label="Debater 2 (CON)"
              value={debater2}
              onChange={setDebater2}
              otherSelected={debater1}
            />
          </div>

          <button
            onClick={startDebate}
            disabled={!topic.trim()}
            className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
              ${!topic.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Start Debate
          </button>
        </div>
      ) : (
        <DebateArena
          topic={topic}
          debater1={debater1}
          debater2={debater2}
          onReset={resetDebate}
        />
      )}
    </div>
  );
}
