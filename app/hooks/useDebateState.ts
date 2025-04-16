import { useState, useCallback } from 'react';

export class DebateError extends Error {
  constructor(message: string, public code: 'MODEL_PROVIDER_ERROR' | 'STREAM_ERROR' | 'UNKNOWN_ERROR' | 'API_KEY_MISSING') {
    super(message);
    this.name = 'DebateError';
  }
}

export function useDebateState() {
  const [rounds, setRounds] = useState<Array<{ debater1: string; debater2: string }>>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentDebater, setCurrentDebater] = useState<'debater1' | 'debater2'>('debater1');
  const [error, setError] = useState<DebateError | null>(null);

  const handleResponseComplete = useCallback((content: string) => {
    try {
      setRounds(prevRounds => {
        const newRounds = [...prevRounds];
        if (!newRounds[currentRound]) {
          newRounds[currentRound] = { debater1: '', debater2: '' };
        }
        newRounds[currentRound][currentDebater] = content.trim();
        return newRounds;
      });

      if (currentDebater === 'debater2') {
        setCurrentRound(prev => prev + 1);
        setCurrentDebater('debater1');
      } else {
        setCurrentDebater('debater2');
      }
    } catch (err) {
      setError(new DebateError(
        err instanceof Error ? err.message : 'Failed to process response',
        'UNKNOWN_ERROR'
      ));
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
    error,
    handleResponseComplete,
    resetDebate
  };
}