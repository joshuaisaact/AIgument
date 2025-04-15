import { useState, useCallback } from 'react';
import { ModelType } from './useModelProvider';

interface UseDebateStateProps {
  topic: string;
  debater1: ModelType;
  debater2: ModelType;
}

interface Round {
  debater1: string;
  debater2: string;
}

export class DebateError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DebateError';
  }
}

export function useDebateState({ topic, debater1, debater2 }: UseDebateStateProps) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentDebater, setCurrentDebater] = useState<'debater1' | 'debater2'>('debater1');
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<DebateError | null>(null);

  const resetDebate = useCallback(() => {
    setRounds([]);
    setCurrentRound(0);
    setCurrentDebater('debater1');
    setIsInitialized(false);
    setError(null);
  }, []);

  const addResponse = useCallback((debater: 'debater1' | 'debater2', content: string) => {
    setRounds(prevRounds => {
      const updatedRounds = [...prevRounds];
      const roundIndex = debater === 'debater1' ? updatedRounds.length - 1 : currentRound;

      if (roundIndex >= 0 && updatedRounds[roundIndex]) {
        updatedRounds[roundIndex] = { ...updatedRounds[roundIndex], [debater]: content };
      } else {
        setError(new DebateError(
          `Internal error: Could not update round ${roundIndex} on finish.`,
          'INTERNAL_ERROR'
        ));
        return prevRounds;
      }
      return updatedRounds;
    });

    if (debater === 'debater1') {
      setCurrentDebater('debater2');
    } else {
      setCurrentDebater('debater1');
      setCurrentRound(prev => prev + 1);
    }
  }, [currentRound]);

  const startNewRound = useCallback(() => {
    setRounds(prevRounds => {
      if (prevRounds.length === currentRound) {
        return [...prevRounds, { debater1: '', debater2: '' }];
      }
      return prevRounds;
    });
  }, [currentRound]);

  return {
    rounds,
    currentRound,
    currentDebater,
    isInitialized,
    setIsInitialized,
    error,
    resetDebate,
    addResponse,
    startNewRound,
    topic,
    debater1,
    debater2
  };
}