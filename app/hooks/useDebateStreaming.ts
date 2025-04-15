import { useState, useCallback } from 'react';
import { streamText, LanguageModelV1, smoothStream } from 'ai';
import { ModelType } from './useModelProvider';
import { DEBATE_PROMPTS } from '../constants/debate';
import { DebateError } from './useDebateState';
import { SpicinessLevel } from '../components/ui/SpicinessSelector';
import { PersonalityId } from '../constants';

interface UseDebateStreamingProps {
  topic: string;
  debater1Model: ModelType;
  debater1Personality: PersonalityId;
  debater2Model: ModelType;
  debater2Personality: PersonalityId;
  spiciness: SpicinessLevel;
  currentRound: number;
  currentDebater: 'debater1' | 'debater2';
  rounds: Array<{ debater1: string; debater2: string }>;
  onResponseComplete: (content: string) => void;
}

export function useDebateStreaming({
  topic,
  debater1Model,
  debater1Personality,
  debater2Model,
  debater2Personality,
  spiciness,
  currentRound,
  currentDebater,
  rounds,
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

    const modelId = currentDebater === 'debater1' ? debater1Model : debater2Model;
    const personalityId = currentDebater === 'debater1' ? debater1Personality : debater2Personality;
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

    const systemPrompt = DEBATE_PROMPTS.getSystemPrompt(
      topic,
      position,
      previousArguments.trim(),
      personalityId,
      spiciness,
      currentRound + 1
    );
    let accumulatedText = '';

    try {
      const modelProviderInstance = getModelProvider(modelId);
      if (!modelProviderInstance) {
        throw new DebateError(`Failed to get model provider instance for ${modelId}`, 'MODEL_PROVIDER_ERROR');
      }

      const result = streamText({
        model: modelProviderInstance,
        prompt: systemPrompt,
        experimental_transform: smoothStream(),
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
  }, [isLoading, currentDebater, currentRound, rounds, debater1Model, debater1Personality, debater2Model, debater2Personality, topic, spiciness, onResponseComplete]);

  return {
    isLoading,
    streamingText,
    error,
    startStreaming
  };
}