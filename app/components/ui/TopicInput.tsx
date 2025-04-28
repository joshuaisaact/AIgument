"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import funnyArguments from "../../constants/funnyArguments.json";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TopicInput({ value, onChange }: TopicInputProps) {
  const [argumentsList] = useState<string[]>(funnyArguments.arguments);

  const getRandomArgument = (): string => {
    const randomIndex = Math.floor(Math.random() * argumentsList.length);
    return argumentsList[randomIndex];
  };

  const handleRandomArgument = (): void => {
    const randomArgument = getRandomArgument();
    onChange(randomArgument);
  };

  return (
    <div className="w-full">
      <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Debate Topic
      </label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg blur-sm group-hover:blur transition-all duration-300" />
        <input
          type="text"
          id="topic"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder="Enter a topic for debate..."
          className="relative w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 pr-12 transition-all duration-300 group-hover:bg-white/90 dark:group-hover:bg-gray-800/90"
        />
        <button
          onClick={handleRandomArgument}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-110 active:scale-95 group"
          title="Get a random debate topic"
          type="button"
        >
          <Shuffle className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300" />
        </button>
      </div>
      <p className="text-sm text-gray-500 pt-2">
        Tip: Make it specific and debatable, e.g., &quot;Should social media companies be responsible for misinformation?&quot;
      </p>
    </div>
  );
}
