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
      <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-ink-muted">
        The motion
      </label>
      <div className="relative">
        <input
          type="text"
          id="topic"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder="This house believes..."
          className="w-full rounded-md border border-rule bg-surface py-2.5 pr-11 pl-3 text-lg text-ink transition-colors placeholder:text-ink-muted/70 hover:border-rule-strong focus:border-ink focus:outline-none"
        />
        <button
          onClick={handleRandomArgument}
          className="absolute top-1/2 right-1 -translate-y-1/2 rounded-md p-2 text-ink-muted transition-colors hover:text-ink"
          title="Pick a topic at random"
          type="button"
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Specific and arguable beats broad. &ldquo;Should social media companies
        be liable for misinformation?&rdquo;
      </p>
    </div>
  );
}
