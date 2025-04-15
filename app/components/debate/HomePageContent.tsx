"use client";

import DebateControls, { DebaterConfig } from './DebateControls';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { SpicinessLevel } from '../../constants/spiciness';

export function HomePageContent() {
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

  const handleStartDebate = () => {
    if (!topic.trim()) return;

    const params = new URLSearchParams({
      topic,
      model1: debater1Config.model,
      personality1: debater1Config.personality,
      model2: debater2Config.model,
      personality2: debater2Config.personality,
      spiciness,
    });
    router.push(`/debate?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-blue-600 dark:text-blue-400">AI</span>
          <span className="text-gray-800 dark:text-white">gument</span>
        </h1>
        <p className="text-xl text-gray-800 dark:text-gray-300 mb-4 pt-4">
          Forget benchmarks. Let AI models debate the issues. Pick your contenders and set the topic.
        </p>
        <p className="text-lg text-gray-800 dark:text-gray-400 max-w-2xl mx-auto">
          Watch arguments unfold, driven by logic, programmed quirks, and maybe a hint of personality. Start the <span className="font-bold text-blue-600 dark:text-blue-400">AI</span><span className="font-bold text-gray-800 dark:text-white">gument</span> and see how it plays out.
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
          <div className="w-full space-y-8">
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
            />
          </div>
        </div>
      </Suspense>
    </div>
  );
}