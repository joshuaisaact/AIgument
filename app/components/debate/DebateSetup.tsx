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
    model: "gpt-6-astra",
    personality: "standard",
  });
  const [debater2Config, setDebater2Config] = useState<DebaterConfig>({
    model: "claude-opus-5",
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
        model: "gemini-demo",
      });
      setDebater2Config({
        ...debater2Config,
        model: "gemini-demo",
      });
    } else {
      // Exiting no API key mode: models remain as they were (flash),
      // but selectors become enabled, allowing user to change.
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-rule p-4">
        <p className="text-sm text-ink-muted">
          {noApiKeyMode
            ? "Demo mode: both sides are Gemini 3.8 Flash."
            : "No API keys? Run a limited demo on Google's model."}
        </p>
        <Button variant="secondary" onClick={handleNoApiKeyClick}>
          {noApiKeyMode ? "Pick models manually" : "Use the demo model"}
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
