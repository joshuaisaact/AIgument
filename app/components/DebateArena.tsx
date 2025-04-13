"use client";

import { useEffect } from "react";
import DebaterResponse from './DebaterResponse';
import { useModelProvider, ModelType } from '../hooks/useModelProvider';
import { useDebate } from '../hooks/useDebate';
import { Button } from './Button';

interface DebateArenaProps {
  topic: string;
  debater1: ModelType;
  debater2: ModelType;
  onReset: () => void;
}

export default function DebateArena({ topic, debater1, debater2, onReset }: DebateArenaProps) {
  const { getModelProvider } = useModelProvider();
  const {
    rounds,
    isLoading,
    error,
    isInitialized,
    setIsInitialized,
    startNextRound,
    resetDebate,
  } = useDebate({ topic, debater1, debater2 });

  useEffect(() => {
    if (!isInitialized) {
      startNextRound(getModelProvider);
      setIsInitialized(true);
    }
  }, [isInitialized, startNextRound, getModelProvider, setIsInitialized]);

  const handleReset = () => {
    resetDebate();
    onReset();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Debate: {topic}</h2>
        <Button variant="secondary" onClick={handleReset}>
          Reset Debate
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {rounds.map((round, index) => (
          <div key={index} className="space-y-4">
            {round.debater1 && (
              <DebaterResponse position="For" model={debater1}>
                {round.debater1}
              </DebaterResponse>
            )}
            {round.debater2 && (
              <DebaterResponse position="Against" model={debater2}>
                {round.debater2}
              </DebaterResponse>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={() => startNextRound(getModelProvider)}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Next Round
      </Button>
    </div>
  );
}