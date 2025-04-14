"use client";

import { useEffect, useRef } from "react";
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
    rounds, isLoading, error, isInitialized, setIsInitialized, startNextRound,
    resetDebate, streamingText, currentDebater, currentRound,
  } = useDebate({ topic, debater1, debater2 });

  const didInitialize = useRef(false);

  useEffect(() => {
    if (!isInitialized && getModelProvider && !didInitialize.current) {
      didInitialize.current = true;
      startNextRound(getModelProvider);
      setIsInitialized(true);
    }
  }, [isInitialized, startNextRound, getModelProvider, setIsInitialized]);

  const handleReset = () => {
    didInitialize.current = false;
    resetDebate(); onReset();
  };

  const handleNextRoundClick = () => { startNextRound(getModelProvider); }

  const streamingRoundIndex = isLoading ? (currentDebater === 'debater1' ? rounds.length - 1 : currentRound) : -1;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Debate: {topic}</h2>
        <Button variant="secondary" onClick={handleReset}> Reset Debate </Button>
      </div>
      {error && ( <div className="p-4 my-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg border border-red-200 dark:border-red-700"> <p className="font-semibold">Error:</p> <p>{error}</p> </div> )}

      <div className="space-y-6">
        {rounds.map((round, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg dark:border-gray-700 shadow-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Round {index + 1}</p>

            <DebaterResponse position="For" model={debater1}>
              {(isLoading && currentDebater === 'debater1' && index === streamingRoundIndex && streamingText !== null)
                ? streamingText
                : round.debater1
              }
            </DebaterResponse>

            {(round.debater1 || (isLoading && currentDebater === 'debater1' && index === streamingRoundIndex)) && (
              <DebaterResponse position="Against" model={debater2}>
                {(isLoading && currentDebater === 'debater2' && index === streamingRoundIndex && streamingText !== null)
                  ? streamingText
                  : round.debater2
                }
              </DebaterResponse>
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={handleNextRoundClick}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Next Round'}
      </Button>
    </div>
  );
}