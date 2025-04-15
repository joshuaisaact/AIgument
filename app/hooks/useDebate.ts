import { useState, useCallback } from 'react';
import { streamText, LanguageModelV1 } from 'ai';
import { ModelType } from './useModelProvider';
import { DEBATE_PROMPTS } from '../constants/debate';

const yieldToEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));

interface UseDebateProps {
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

export function useDebate({ topic, debater1, debater2 }: UseDebateProps) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentDebater, setCurrentDebater] = useState<'debater1' | 'debater2'>('debater1');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<DebateError | null>(null);
  const [streamingText, setStreamingText] = useState<string | null>(null);

  const resetDebate = useCallback(() => {
    setRounds([]);
    setCurrentRound(0);
    setCurrentDebater('debater1');
    setIsInitialized(false);
    setError(null);
    setIsLoading(false);
    setStreamingText(null);
  }, []);

  const startNextRound = useCallback(async (getModelProvider: (model: ModelType) => LanguageModelV1) => {
    if (isLoading) {
      return;
    }

    const callTimeDebater = currentDebater;
    const callTimeRound = currentRound;
    const currentRoundsState = rounds;

    setIsLoading(true);
    setError(null);
    setStreamingText('');
    const modelId = callTimeDebater === 'debater1' ? debater1 : debater2;
    const position = callTimeDebater === 'debater1' ? 'PRO' : 'CON';

    let previousArguments = '';
    for (let i = 0; i < callTimeRound; i++) {
      if (currentRoundsState[i]?.debater1 && currentRoundsState[i]?.debater2) {
        previousArguments += `${currentRoundsState[i].debater1}\n\n`;
        previousArguments += `${currentRoundsState[i].debater2}\n\n`;
      }
    }
    if (callTimeDebater === 'debater2' && currentRoundsState.length > callTimeRound && currentRoundsState[callTimeRound]?.debater1) {
      previousArguments += `${currentRoundsState[callTimeRound].debater1}\n\n`;
    }

    const systemPrompt = DEBATE_PROMPTS.getSystemPrompt(topic, position, previousArguments.trim(), callTimeRound + 1);

    if (callTimeDebater === 'debater1' && currentRoundsState.length === callTimeRound) {
      setRounds(prevRounds => {
        if (prevRounds.length === callTimeRound) return [...prevRounds, { debater1: '', debater2: '' }];
        return prevRounds;
      });
    }

    let accumulatedText = '';

    try {
      const modelProviderInstance = getModelProvider(modelId);
      if (!modelProviderInstance) {
        throw new DebateError(`Failed to get model provider instance for ${modelId}`, 'MODEL_PROVIDER_ERROR');
      }

      const result = streamText({
        model: modelProviderInstance,
        prompt: systemPrompt,
        onError: (event) => {
          console.error(`[useDebate] streamText error:`, event.error);
          setError(new DebateError(
            event.error instanceof Error ? event.error.message : 'Stream error',
            'STREAM_ERROR'
          ));
        },
      });

      for await (const textPart of result.textStream) {
        accumulatedText += textPart;
        setStreamingText(accumulatedText);
        await yieldToEventLoop();
      }

      setRounds(prevRounds => {
        const updatedRounds = [...prevRounds];
        const roundIndex = callTimeDebater === 'debater1' ? updatedRounds.length - 1 : callTimeRound;
        if (roundIndex >= 0 && updatedRounds[roundIndex]) {
          updatedRounds[roundIndex] = { ...updatedRounds[roundIndex], [callTimeDebater]: accumulatedText };
        } else {
          setError(new DebateError(
            `Internal error: Could not update round ${roundIndex} on finish.`,
            'INTERNAL_ERROR'
          ));
          return prevRounds;
        }
        return updatedRounds;
      });

      if (callTimeDebater === 'debater1') {
        setCurrentDebater('debater2');
      } else {
        setCurrentDebater('debater1');
        setCurrentRound(prev => prev + 1);
      }

    } catch (error) {
      console.error(`[useDebate] Error:`, error);
      if (error instanceof DebateError) {
        setError(error);
      } else {
        setError(new DebateError(
          error instanceof Error ? error.message : String(error),
          'UNKNOWN_ERROR'
        ));
      }
    } finally {
      setStreamingText(null);
      setIsLoading(false);
    }
  }, [isLoading, currentDebater, currentRound, rounds, debater1, debater2, topic]);

  return {
    rounds,
    currentRound,
    currentDebater,
    isLoading,
    error,
    isInitialized,
    setIsInitialized,
    startNextRound,
    resetDebate,
    streamingText
  };
}