"use client";

import DebateControls, { DebaterConfig } from "./DebateControls";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpicinessLevel } from "../../constants/spiciness";
import { Button } from "../ui/Button";

export function DebateSetup() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [debater1Config, setDebater1Config] = useState<DebaterConfig>({
    model: "gpt4",
    personality: "standard",
  });
  const [debater2Config, setDebater2Config] = useState<DebaterConfig>({
    model: "claude-sonnet",
    personality: "standard",
  });
  const [spiciness, setSpiciness] = useState<SpicinessLevel>("medium");
  const [isPending, setIsPending] = useState(false);
  const [noApiKeyMode, setNoApiKeyMode] = useState(false);

  const handleStartDebate = () => {
    if (topic.trim()) {
      setIsPending(true);
      const params = new URLSearchParams({
        topic,
        model1: debater1Config.model,
        personality1: debater1Config.personality,
        model2: debater2Config.model,
        personality2: debater2Config.personality,
        spiciness,
      });
      router.push(`/debate?${params.toString()}`);
    }
  };

  const handleNoApiKeyClick = () => {
    const nextMode = !noApiKeyMode;
    setNoApiKeyMode(nextMode);

    if (nextMode) {
      // Entering no API key mode: set models to flash
      setDebater1Config({
        ...debater1Config,
        model: "gemini-2.5-flash",
      });
      setDebater2Config({
        ...debater2Config,
        model: "gemini-2.5-flash",
      });
    } else {
      // Exiting no API key mode: models remain as they were (flash),
      // but selectors become enabled, allowing user to change.
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-full max-w-2xl p-4 rounded-lg bg-blue-50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700/60 text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {noApiKeyMode
            ? "Demo mode active (Using Gemini 2.5 Flash)."
            : "Don't have API keys? Try a limited demo using Google's model:"}
        </p>
        <Button
          variant="secondary"
          onClick={handleNoApiKeyClick}
          className={noApiKeyMode ? "opacity-80" : ""}
        >
          {noApiKeyMode
            ? "Allow Manual Model Selection"
            : "Use Gemini 2.5 Flash for Both"}
        </Button>
      </div>

      <DebateControls
        topic={topic}
        setTopic={setTopic}
        debater1Config={debater1Config}
        setDebater1Config={setDebater1Config}
        debater2Config={debater2Config}
        setDebater2Config={setDebater2Config}
        spiciness={spiciness}
        setSpiciness={setSpiciness}
        onStartDebate={handleStartDebate}
        isPending={isPending}
        disableModelSelection={noApiKeyMode}
      />
    </div>
  );
}
