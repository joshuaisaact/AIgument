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

    if (isLoading) {
      console.log("Already loading, skipping startNextRound call.");
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log(`[useDebate Step 1] Starting round. Debater: ${currentDebater}, Round: ${currentRound}`);

    const modelId = currentDebater === 'debater1' ? debater1 : debater2;
    const position = currentDebater === 'debater1' ? 'PRO' : 'CON';

    let previousArguments = '';
    for (let i = 0; i < currentRound; i++) {
      if (rounds[i]?.debater1 && rounds[i]?.debater2) {
        previousArguments += `PRO: ${rounds[i].debater1}\n`;
        previousArguments += `CON: ${rounds[i].debater2}\n`;
      }
    }

    if (currentDebater === 'debater2' && rounds.length > currentRound && rounds[currentRound]?.debater1) {
      previousArguments += `PRO: ${rounds[currentRound].debater1}\n`;
    }

    const systemPrompt = DEBATE_PROMPTS.getSystemPrompt(topic, position, previousArguments.trim());

    try {
      const modelProviderInstance = getModelProvider(modelId);
      if (!modelProviderInstance) {
        throw new Error(`Failed to get model provider instance for ${modelId}`);
      }

      console.log(`[useDebate Step 1] Calling streamText for ${currentDebater}...`);

      const { text } = await generateText({
        model: modelProviderInstance,
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