import { useState, useCallback } from 'react';
import { generateText } from 'ai';
import { ModelType } from './useModelProvider';
import { DEBATE_PROMPTS } from '../constants/debate';

interface Round {
  debater1: string;
  debater2: string;
}

interface UseDebateProps {
  topic: string;
  debater1: ModelType;
  debater2: ModelType;
}

export function useDebate({ topic, debater1, debater2 }: UseDebateProps) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentDebater, setCurrentDebater] = useState<'debater1' | 'debater2'>('debater1');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetDebate = useCallback(() => {
    setRounds([]);
    setCurrentRound(0);
    setCurrentDebater('debater1');
    setIsInitialized(false);
    setError(null);
  }, []);

  const startNextRound = useCallback(async (getModelProvider: (model: ModelType) => any) => {
    setIsLoading(true);
    setError(null);

    try {
      const model = currentDebater === 'debater1' ? debater1 : debater2;
      const position = currentDebater === 'debater1' ? 'PRO' : 'CON';
      const previousArguments = rounds
        .map((round, index) => {
          const otherPosition = index % 2 === 0 ? 'CON' : 'PRO';
          return `${otherPosition}: ${round[currentDebater === 'debater1' ? 'debater2' : 'debater1']}`;
        })
        .join('\n');

      const systemPrompt = DEBATE_PROMPTS.getSystemPrompt(topic, position, previousArguments);
      const { text } = await generateText({
        model: getModelProvider(model),
        prompt: systemPrompt,
      });

      if (currentDebater === 'debater1') {
        setRounds([...rounds, { debater1: text, debater2: '' }]);
      } else {
        const updatedRounds = [...rounds];
        updatedRounds[currentRound] = {
          ...updatedRounds[currentRound],
          debater2: text,
        };
        setRounds(updatedRounds);
        setCurrentRound(currentRound + 1);
      }

      setCurrentDebater(currentDebater === 'debater1' ? 'debater2' : 'debater1');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during the debate');
      console.error('Error generating text:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentDebater, currentRound, debater1, debater2, rounds, topic]);

  return {
    rounds,
    currentDebater,
    isLoading,
    error,
    isInitialized,
    setIsInitialized,
    startNextRound,
    resetDebate,
  };
}