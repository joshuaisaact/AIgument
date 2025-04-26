import { useState, useCallback } from "react";
import { streamText, LanguageModelV1, smoothStream, CoreMessage } from "ai";
import { ModelType } from "./useModelProvider";
import { DEBATE_PROMPTS } from "../constants/debate";
import { DebateError } from "./useDebateState";
import { SpicinessLevel } from "../constants/spiciness";
import { PersonalityId } from "../constants";

// --- Restore custom readStream helper ---
async function readStream(
  stream: ReadableStream<Uint8Array>,
  onChunk: (chunk: string) => void,
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    try {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        const decodedChunk = decoder.decode(value, { stream: true });
        onChunk(decodedChunk);
      }
    } catch (error) {
      console.error("[Client readStream] Error reading chunk:", error);
      done = true;
      throw error;
    }
  }
}

interface UseDebateStreamingProps {
  topic: string;
  debater1Model: ModelType;
  debater1Personality: PersonalityId;
  debater2Model: ModelType;
  debater2Personality: PersonalityId;
  spiciness: SpicinessLevel;
  currentRound: number;
  currentDebater: "debater1" | "debater2";
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
  onResponseComplete,
}: UseDebateStreamingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [error, setError] = useState<DebateError | null>(null);

  const startStreaming = useCallback(
    async (getModelProvider: (model: ModelType) => LanguageModelV1) => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);
      setStreamingText(null);

      const modelId =
        currentDebater === "debater1" ? debater1Model : debater2Model;
      const personalityId =
        currentDebater === "debater1"
          ? debater1Personality
          : debater2Personality;
      const position = currentDebater === "debater1" ? "PRO" : "CON";

      let previousArguments = "";
      for (let i = 0; i < currentRound; i++) {
        if (rounds[i]?.debater1)
          previousArguments += `Pro: ${rounds[i].debater1}\n\n`;
        if (rounds[i]?.debater2)
          previousArguments += `Con: ${rounds[i].debater2}\n\n`;
      }
      if (
        currentDebater === "debater2" &&
        rounds.length > currentRound &&
        rounds[currentRound]?.debater1
      ) {
        previousArguments += `Pro: ${rounds[currentRound].debater1}\n\n`;
      }

      const systemPrompt = DEBATE_PROMPTS.getSystemPrompt(
        topic,
        position,
        previousArguments.trim(),
        personalityId,
        spiciness,
        currentRound + 1,
      );
      let accumulatedText = "";

      try {
        if (modelId === "gemini-2.5-flash") {
          const messages: CoreMessage[] = [
            { role: "system", content: systemPrompt },
          ];

          const response = await fetch("/api/gemini-flash", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages }),
          });

          if (!response.ok) {
            const errorData = await response
              .json()
              .catch(() => ({ error: "Failed to parse error response" }));
            console.error("[useDebateStreaming] API fetch error:", errorData);
            throw new DebateError(
              `API Error (${response.status}): ${errorData?.error || "Failed to fetch from API"}`,
              "API_FETCH_ERROR",
            );
          }

          if (!response.body) {
            console.error("[useDebateStreaming] API response missing body");
            throw new DebateError(
              "API response missing body",
              "API_FETCH_ERROR",
            );
          }

          try {
            await readStream(response.body, (chunk) => {
              accumulatedText += chunk;
              setStreamingText(accumulatedText);
            });
          } catch (streamReadError) {
            console.error(
              "[useDebateStreaming] Error during stream reading:",
              streamReadError,
            );
            throw new DebateError(
              streamReadError instanceof Error
                ? streamReadError.message
                : "Failed to read stream",
              "STREAM_ERROR",
            );
          }

          onResponseComplete(accumulatedText);
        } else {
          const modelProviderInstance = getModelProvider(modelId);
          if (!modelProviderInstance) {
            throw new DebateError(
              `Failed to get model provider instance for ${modelId}`,
              "MODEL_PROVIDER_ERROR",
            );
          }

          const result = streamText({
            model: modelProviderInstance,
            prompt: systemPrompt,
            experimental_transform: smoothStream(),
            onError: (event) => {
              console.error(
                `[useDebateStreaming] streamText error:`,
                event.error,
              );
              setError(
                new DebateError(
                  event.error instanceof Error
                    ? event.error.message
                    : "Stream error",
                  "STREAM_ERROR",
                ),
              );
            },
          });

          for await (const textPart of result.textStream) {
            accumulatedText += textPart;
            setStreamingText(accumulatedText);
          }
          onResponseComplete(accumulatedText);
        }
      } catch (error) {
        console.error(`[useDebateStreaming] Error:`, error);
        if (error instanceof Error && error.name === "MissingApiKeyError") {
          setError(new DebateError(error.message, "API_KEY_MISSING"));
        } else if (error instanceof DebateError) {
          setError(error);
        } else {
          setError(
            new DebateError(
              error instanceof Error ? error.message : String(error),
              "UNKNOWN_ERROR",
            ),
          );
        }
      } finally {
        setStreamingText(null);
        setIsLoading(false);
      }
    },
    [
      isLoading,
      currentDebater,
      currentRound,
      rounds,
      debater1Model,
      debater1Personality,
      debater2Model,
      debater2Personality,
      topic,
      spiciness,
      onResponseComplete,
    ],
  );

  return {
    isLoading,
    streamingText,
    error,
    startStreaming,
  };
}
