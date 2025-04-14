import { useState, useCallback } from 'react';
import { streamText } from 'ai';
import { ModelType } from './useModelProvider';
import { DEBATE_PROMPTS } from '../constants/debate';

const yieldToEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));

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
  const [streamingText, setStreamingText] = useState<string | null>(null);

  const resetDebate = useCallback(() => {
    setRounds([]); setCurrentRound(0); setCurrentDebater('debater1');
    setIsInitialized(false); setError(null); setIsLoading(false); setStreamingText(null);
  }, []);

  const startNextRound = useCallback(async (getModelProvider: (model: ModelType) => any) => {
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
        previousArguments += `PRO: ${currentRoundsState[i].debater1}\n`;
        previousArguments += `CON: ${currentRoundsState[i].debater2}\n`;
      }
    }
    if (callTimeDebater === 'debater2' && currentRoundsState.length > callTimeRound && currentRoundsState[callTimeRound]?.debater1) {
      previousArguments += `PRO: ${currentRoundsState[callTimeRound].debater1}\n`;
    }

    const systemPrompt = DEBATE_PROMPTS.getSystemPrompt(topic, position, previousArguments.trim());

    if (callTimeDebater === 'debater1' && currentRoundsState.length === callTimeRound) {
      setRounds(prevRounds => {
        if (prevRounds.length === callTimeRound) return [...prevRounds, { debater1: '', debater2: '' }];
        return prevRounds;
      });
    }

    let accumulatedText = '';

    try {
      const modelProviderInstance = getModelProvider(modelId);
      if (!modelProviderInstance) throw new Error(`Failed to get model provider instance for ${modelId}`);

      const result = streamText({
        model: modelProviderInstance, prompt: systemPrompt,
        onError: (event) => {
          console.error(`[useDebate] streamText error:`, event.error);
          setError(event.error instanceof Error ? event.error.message : 'Stream error');
        },
      });

      for await (const textPart of result.textStream) {
        accumulatedText += textPart;
        setStreamingText(accumulatedText);
        await yieldToEventLoop();
      }

      const finishReason = await result.finishReason;

      setRounds(prevRounds => {
        const updatedRounds = [...prevRounds];
        const roundIndex = callTimeDebater === 'debater1' ? updatedRounds.length - 1 : callTimeRound;
        if (roundIndex >= 0 && updatedRounds[roundIndex]) {
          updatedRounds[roundIndex] = { ...updatedRounds[roundIndex], [callTimeDebater]: accumulatedText };
        } else {
          setError(`Internal error: Could not update round ${roundIndex} on finish.`);
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
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setStreamingText(null);
      setIsLoading(false);
    }
  }, [currentDebater, currentRound, debater1, debater2, topic]);

  return { rounds, currentRound, currentDebater, isLoading, error, isInitialized, setIsInitialized, startNextRound, resetDebate, streamingText };
}