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
    <div className="space-y-8">
      <TopicInput value={topic} onChange={setTopic} />

      <div className="space-y-6">
        <section className="rounded-md border border-rule p-4">
          <h3 className="mb-4 text-sm font-semibold text-pro">For the motion</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </section>

        <section className="rounded-md border border-rule p-4">
          <h3 className="mb-4 text-sm font-semibold text-con">Against the motion</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </section>
      </div>

      <SpicinessSelector value={spiciness} onChange={setSpiciness} />

      <Button
        onClick={onStartDebate}
        disabled={!topic.trim() || isPending}
        isLoading={isPending}
        className="w-full py-3"
      >
        Begin the debate
      </Button>
    </div>
  );
}
