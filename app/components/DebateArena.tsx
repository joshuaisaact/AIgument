"use client";

import { useState, useEffect } from "react";
import { generateText } from "ai";
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Debug environment variables
const debugEnv = () => {
  const env = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NEXT_PUBLIC_ANTHROPIC_API_KEY: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
  };
  console.log('Environment variables:', env);
  return env;
};

// Helper function to get environment variables
const getEnvVar = (name: string) => {
  const env = debugEnv();
  const value = env[name as keyof typeof env];
  console.log(`Getting env var ${name}:`, value);
  if (!value) {
    console.error(`Missing environment variable: ${name}`);
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

// Configure OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

// Configure Google provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '',
});

// Configure Anthropic provider
const anthropic = createAnthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
});

interface DebateArenaProps {
  topic: string;
  debater1: string;
  debater2: string;
  onReset: () => void;
}

const getModelProvider = (model: string) => {
  switch (model) {
    case "claude":
      return anthropic("claude-3-sonnet");
    case "gpt4":
      return openai("gpt-4-turbo");
    case "gpt35":
      return openai("gpt-3.5-turbo");
    case "gemini":
      return google("gemini-1.5-flash");
    default:
      throw new Error(`Unknown model: ${model}`);
  }
};

export default function DebateArena({
  topic,
  debater1,
  debater2,
  onReset,
}: DebateArenaProps) {
  const [rounds, setRounds] = useState<Array<{ debater1: string; debater2: string }>>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentDebater, setCurrentDebater] = useState<"debater1" | "debater2">("debater1");
  const [currentMessage, setCurrentMessage] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const startDebate = async () => {
    try {
      setError(null);
      const model = currentDebater === "debater1" ? debater1 : debater2;
      const position = currentDebater === "debater1" ? "for" : "against";
      const role = currentDebater;

      const systemPrompt = role === "debater1"
        ? `You are Debater 1 in a debate about "${topic}". You are taking the PRO position.
           This is round ${currentRound} of the debate. Be persuasive, use logical arguments, and respond to Debater 2's points when they make them.
           Keep your responses concise and focused.${currentRound > 1
            ? `
           Your previous argument: ${rounds[currentRound - 2]?.debater1}
           Your opponent's previous argument: ${rounds[currentRound - 2]?.debater2}`
            : ""}`
        : `You are Debater 2 in a debate about "${topic}". You are taking the CON position.
           This is round ${currentRound} of the debate. Be persuasive, use logical arguments, and respond to Debater 1's points when they make them.
           Keep your responses concise and focused.${currentRound > 1
            ? `
           Your previous argument: ${rounds[currentRound - 2]?.debater2}
           Your opponent's previous argument: ${rounds[currentRound - 2]?.debater1}`
            : ""}`;

      const { text } = await generateText({
        model: getModelProvider(model),
        system: systemPrompt,
        prompt: currentRound === 1
          ? "Please present your opening argument."
          : "Please respond to your opponent's points and present your next argument.",
      });

      setCurrentMessage(text);

      if (currentDebater === "debater1") {
        // Store Debater 1's response and switch to Debater 2
        const newRound = {
          debater1: text,
          debater2: "",
        };
        setRounds((prev) => [...prev, newRound]);
        setCurrentDebater("debater2");
      } else {
        // Update the current round with Debater 2's response
        setRounds((prev) => {
          const updatedRounds = [...prev];
          updatedRounds[currentRound - 1] = {
            ...updatedRounds[currentRound - 1],
            debater2: text,
          };
          return updatedRounds;
        });
        setCurrentRound((prev) => prev + 1);
        setCurrentDebater("debater1");
      }
      setCurrentMessage("");
    } catch (err) {
      setError(err as Error);
    }
  };

  // Start the first round automatically when the component mounts
  useEffect(() => {
    if (!isInitialized && currentRound === 1 && rounds.length === 0) {
      setIsInitialized(true);
      startDebate();
    }
  }, [currentRound, rounds.length, isInitialized]);

  // Handle debater 1's response
  useEffect(() => {
    if (currentDebater === "debater2" && currentMessage === "" && isInitialized) {
      startDebate();
    }
  }, [currentDebater, currentMessage, isInitialized]);

  const startNextRound = async () => {
    if (currentRound > 3) return;
    startDebate();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Topic: {topic}
        </h2>
        <div className="flex justify-between text-sm text-gray-700 mb-4">
          <div>For: {debater1}</div>
          <div>Against: {debater2}</div>
        </div>

        <div className="space-y-6">
          {rounds.map((round, i) => (
            <div key={i} className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded">
                <p className="whitespace-pre-wrap text-gray-900">
                  {round.debater1}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded">
                <p className="whitespace-pre-wrap text-gray-900">
                  {round.debater2}
                </p>
              </div>
            </div>
          ))}

          {currentMessage && (
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded ${
                  currentDebater === "debater1" ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                {currentDebater === "debater1" && (
                  <p className="whitespace-pre-wrap text-gray-900">
                    {currentMessage}
                  </p>
                )}
              </div>
              <div
                className={`p-4 rounded ${
                  currentDebater === "debater2" ? "bg-red-50" : "bg-gray-50"
                }`}
              >
                {currentDebater === "debater2" && (
                  <p className="whitespace-pre-wrap text-gray-900">
                    {currentMessage}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            An error occurred: {error.message}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            New Debate
          </button>

          {currentRound <= 3 && (
            <button
              onClick={startNextRound}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next Round
            </button>
          )}
        </div>
      </div>
    </div>
  );
}