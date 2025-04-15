"use client";

import { useEffect, useRef, useState } from "react";
import DebaterResponse from './DebaterResponse';
import { useModelProvider, ModelType } from '../../hooks/useModelProvider';
import { useDebateState } from '../../hooks/useDebateState';
import { useDebateStreaming } from '../../hooks/useDebateStreaming';
import { Button } from '../ui/Button';
import { saveDebate } from '../../lib/actions/debate';
import { MODEL_CONFIGS } from '../../constants/debate';
import Image from 'next/image';

interface DebateArenaProps {
  topic: string;
  debater1: ModelType;
  debater2: ModelType;
  onReset: () => void;
}

export default function DebateArena({ topic, debater1, debater2, onReset }: DebateArenaProps) {
  const { getModelProvider } = useModelProvider();
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    rounds,
    currentDebater,
    error,
    resetDebate,
    handleResponseComplete
  } = useDebateState();

  const {
    isLoading,
    streamingText,
    startStreaming
  } = useDebateStreaming({
    topic,
    debater1,
    debater2,
    currentRound: rounds.length - 1,
    currentDebater,
    rounds,
    spiciness: 'medium',
    onResponseComplete: handleResponseComplete
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [rounds, streamingText]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      startStreaming(getModelProvider);
    }
  }, [isInitialized, startStreaming, getModelProvider]);

  const handleNextRound = () => {
    startStreaming(getModelProvider);
  };

  const handleReset = () => {
    resetDebate();
    setIsInitialized(false);
    onReset();
  };

  const handleSave = async () => {
    try {
      const messages = rounds.flatMap(round => [
        { role: 'pro' as const, content: round.debater1 },
        { role: 'con' as const, content: round.debater2 }
      ]).filter(msg => msg.content);

      await saveDebate({
        topic,
        proModel: debater1,
        conModel: debater2,
        messages
      });
    } catch (error) {
      console.error('Failed to save debate:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{topic}</h1>
        <div className="mt-2 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Image
              src={MODEL_CONFIGS[debater1].logo}
              alt={MODEL_CONFIGS[debater1].alt}
              width={20}
              height={20}
              className="w-5 h-5 dark:invert dark:opacity-80"
            />
            <span>For: {MODEL_CONFIGS[debater1].name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={MODEL_CONFIGS[debater2].logo}
              alt={MODEL_CONFIGS[debater2].alt}
              width={20}
              height={20}
              className="w-5 h-5 dark:invert dark:opacity-80"
            />
            <span>Against: {MODEL_CONFIGS[debater2].name}</span>
          </div>
        </div>
      </div>

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

        {streamingText && (
          <DebaterResponse
            position={currentDebater === 'debater1' ? 'For' : 'Against'}
            model={currentDebater === 'debater1' ? debater1 : debater2}
          >
            {streamingText}
          </DebaterResponse>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error.message}
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Button
          onClick={handleNextRound}
          disabled={isLoading || streamingText !== null}
          isLoading={isLoading}
        >
          {isLoading ? 'Debating...' : 'Next Response'}
        </Button>
        <Button
          onClick={handleReset}
          variant="secondary"
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button
          onClick={handleSave}
          variant="secondary"
          disabled={isLoading || rounds.length === 0}
        >
          Save Debate
        </Button>
      </div>
    </div>
  );
}