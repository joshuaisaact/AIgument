import { useState, useCallback } from 'react';
import { streamText, LanguageModelV1 } from 'ai';
import { ModelType } from './useModelProvider';
import { DEBATE_PROMPTS } from '../constants/debate';
import { DebateError } from './useDebateState';
import { SpicinessLevel } from '../components/ui/SpicinessSelector';

const yieldToEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));

interface UseDebateStreamingProps {
  topic: string;
  debater1: ModelType;
  debater2: ModelType;
  currentRound: number;
  currentDebater: 'debater1' | 'debater2';
  rounds: Array<{ debater1: string; debater2: string }>;
  spiciness: SpicinessLevel;
  onResponseComplete: (content: string) => void;
}

export function useDebateStreaming({
  topic,
  debater1,
  debater2,
  currentRound,
  currentDebater,
  rounds,
  spiciness,
  onResponseComplete
}: UseDebateStreamingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [error, setError] = useState<DebateError | null>(null);

  const startStreaming = useCallback(async (getModelProvider: (model: ModelType) => LanguageModelV1) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setStreamingText(null);

    const modelId = currentDebater === 'debater1' ? debater1 : debater2;
    const position = currentDebater === 'debater1' ? 'PRO' : 'CON';

    let previousArguments = '';
    for (let i = 0; i < currentRound; i++) {
      if (rounds[i]?.debater1 && rounds[i]?.debater2) {
        previousArguments += `${rounds[i].debater1}\n\n`;
        previousArguments += `${rounds[i].debater2}\n\n`;
      }
    }
    if (currentDebater === 'debater2' && rounds.length > currentRound && rounds[currentRound]?.debater1) {
      previousArguments += `${rounds[currentRound].debater1}\n\n`;
    }

    const systemPrompt = DEBATE_PROMPTS.getSystemPrompt(topic, position, previousArguments.trim(), spiciness, currentRound + 1);
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
          console.error(`[useDebateStreaming] streamText error:`, event.error);
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

      onResponseComplete(accumulatedText);
    } catch (error) {
      console.error(`[useDebateStreaming] Error:`, error);
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
  }, [isLoading, currentDebater, currentRound, rounds, debater1, debater2, topic, spiciness, onResponseComplete]);

  return {
    isLoading,
    streamingText,
    error,
    startStreaming
  };
}