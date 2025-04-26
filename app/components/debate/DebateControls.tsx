"use client";

import ModelSelector from "../ui/ModelSelector";
import PersonalitySelector from "../ui/PersonalitySelector";
import TopicInput from "../ui/TopicInput";
import { ModelType } from "../../hooks/useModelProvider";
import { Button } from "../ui/Button";
import { SpicinessSelector } from "../ui/SpicinessSelector";
import { SpicinessLevel } from "../../constants/spiciness";
import { PersonalityId } from "@/app/constants";

export interface DebaterConfig {
  model: ModelType;
  personality: PersonalityId;
}

interface DebateControlsProps {
  topic: string;
  setTopic: (topic: string) => void;
  debater1Config: DebaterConfig;
  setDebater1Config: (config: DebaterConfig) => void;
  debater2Config: DebaterConfig;
  setDebater2Config: (config: DebaterConfig) => void;
  spiciness: SpicinessLevel;
  setSpiciness: (value: SpicinessLevel) => void;
  onStartDebate: () => void;
  isPending?: boolean;
  disableModelSelection?: boolean;
}

export default function DebateControls({
  topic,
  setTopic,
  debater1Config,
  setDebater1Config,
  debater2Config,
  setDebater2Config,
  spiciness,
  setSpiciness,
  onStartDebate,
  isPending = false,
  disableModelSelection = false,
}: DebateControlsProps) {
  const handleDebater1ModelChange = (model: ModelType) => {
    setDebater1Config({ ...debater1Config, model });
  };
  const handleDebater1PersonalityChange = (personality: PersonalityId) => {
    setDebater1Config({ ...debater1Config, personality });
  };
  const handleDebater2ModelChange = (model: ModelType) => {
    setDebater2Config({ ...debater2Config, model });
  };
  const handleDebater2PersonalityChange = (personality: PersonalityId) => {
    setDebater2Config({ ...debater2Config, personality });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <TopicInput value={topic} onChange={setTopic} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg bg-blue-50/30 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30">
        <h3 className="md:col-span-2 text-lg font-semibold text-blue-800 dark:text-blue-300 border-b pb-2 mb-2 border-blue-200 dark:border-blue-800/50">
          Debater 1 (For)
        </h3>
        <ModelSelector
          label="Model"
          value={debater1Config.model}
          onChange={handleDebater1ModelChange}
          disabled={disableModelSelection}
        />
        <PersonalitySelector
          label="For"
          value={debater1Config.personality}
          onChange={handleDebater1PersonalityChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-4 rounded-lg bg-red-50/30 dark:bg-red-900/10 border-red-200 dark:border-red-800/30">
        <h3 className="md:col-span-2 text-lg font-semibold text-red-800 dark:text-red-300 border-b pb-2 mb-2 border-red-200 dark:border-red-800/50">
          Debater 2 (Against)
        </h3>
        <ModelSelector
          label="Model"
          value={debater2Config.model}
          onChange={handleDebater2ModelChange}
          disabled={disableModelSelection}
        />
        <PersonalitySelector
          label="Against"
          value={debater2Config.personality}
          onChange={handleDebater2PersonalityChange}
        />
      </div>

      <SpicinessSelector value={spiciness} onChange={setSpiciness} />

      <Button
        onClick={onStartDebate}
        disabled={!topic.trim() || isPending}
        isLoading={isPending}
        className="w-full"
      >
        Start Debate
      </Button>
    </div>
  );
}
