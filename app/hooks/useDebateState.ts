import { useState, useCallback } from 'react';
import { ModelType } from './useModelProvider';
import { SpicinessLevel } from '../components/ui/SpicinessSelector';

export class DebateError extends Error {
  constructor(message: string, public code: 'MODEL_PROVIDER_ERROR' | 'STREAM_ERROR' | 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'DebateError';
  }
}

interface UseDebateStateProps {
  topic: string;
  debater1: ModelType;
  debater2: ModelType;
  spiciness: SpicinessLevel;
}

export function useDebateState({ topic, debater1, debater2, spiciness }: UseDebateStateProps) {
  const [rounds, setRounds] = useState<Array<{ debater1: string; debater2: string }>>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentDebater, setCurrentDebater] = useState<'debater1' | 'debater2'>('debater1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<DebateError | null>(null);

  const handleResponseComplete = useCallback((content: string) => {
    setRounds(prevRounds => {
      const newRounds = [...prevRounds];
      if (!newRounds[currentRound]) {
        newRounds[currentRound] = { debater1: '', debater2: '' };
      }
      newRounds[currentRound][currentDebater] = content;
      return newRounds;
    });

    if (currentDebater === 'debater2') {
      setCurrentRound(prev => prev + 1);
      setCurrentDebater('debater1');
    } else {
      setCurrentDebater('debater2');
    }
  }, [currentRound, currentDebater]);

  const resetDebate = useCallback(() => {
    setRounds([]);
    setCurrentRound(0);
    setCurrentDebater('debater1');
    setError(null);
  }, []);

  return {
    rounds,
    currentRound,
    currentDebater,
    isLoading,
    error,
    handleResponseComplete,
    resetDebate
  };
}