"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import DebaterResponse from './DebaterResponse';
import { useModelProvider, ModelType } from '../../hooks/useModelProvider';
import { SpicinessLevel } from '../../constants/spiciness';
import { useDebateState } from '../../hooks/useDebateState';
import { useDebateStreaming } from '../../hooks/useDebateStreaming';
import { Button } from '../ui/Button';
import { saveDebate } from '../../lib/actions/debate';
import { MODEL_CONFIGS } from '../../constants/models';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { PERSONALITY_CONFIGS, PersonalityId, SPICINESS_CONFIGS } from "@/app/constants";
import { ConfirmSaveModal } from './ConfirmSaveModal';
import ModelLogo from '../ui/ModelLogo';

interface DebateArenaProps {
  topic: string;
  debater1Model: ModelType;
  debater1Personality: PersonalityId;
  debater2Model: ModelType;
  debater2Personality: PersonalityId;
  spiciness: SpicinessLevel;
  onReset: () => void;
}

export default function DebateArena({
  topic,
  debater1Model,
  debater1Personality,
  debater2Model,
  debater2Personality,
  spiciness,
  onReset,
}: DebateArenaProps) {
  const { getModelProvider } = useModelProvider();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const {
    rounds,
    currentDebater,
    currentRound,
    error: stateError,
    resetDebate,
    handleResponseComplete
  } = useDebateState();

  const {
    isLoading: isStreamingLoading,
    streamingText,
    error: streamingError,
    startStreaming
  } = useDebateStreaming({
    topic,
    debater1Model,
    debater1Personality,
    debater2Model,
    debater2Personality,
    spiciness,
    currentRound,
    currentDebater,
    rounds,
    onResponseComplete: handleResponseComplete
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const didMountRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [rounds, streamingText]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      startStreaming(getModelProvider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextRound = () => {
    startStreaming(getModelProvider);
  };

  const handleReset = () => {
    resetDebate();
    didMountRef.current = false;
    onReset();
  };

  const executeSave = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const messages = rounds.flatMap(round => [
        { role: 'pro' as const, content: round.debater1 },
        { role: 'con' as const, content: round.debater2 }
      ]).filter(msg => msg.content);

      const debateId = await saveDebate({
        topic,
        proModel: debater1Model,
        conModel: debater2Model,
        proPersonality: debater1Personality,
        conPersonality: debater2Personality,
        messages,
        spiciness
      });

      setSaveSuccess(`Debate saved successfully! ID: ${debateId}`);
      toast.success('Debate saved successfully!');
    } catch (error) {
      console.error('Failed to save debate:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save debate';
      setSaveError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [rounds, topic, debater1Model, debater2Model, spiciness, debater1Personality, debater2Personality]);

  const handleOpenSaveModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseSaveModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmSave = () => {
    handleCloseSaveModal();
    executeSave();
  };

  const currentModel = currentDebater === 'debater1' ? debater1Model : debater2Model;
  const displayError = streamingError || stateError;
  const isLoading = isStreamingLoading || isSaving;
  const spicinessConfig = SPICINESS_CONFIGS[spiciness];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">{topic}</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-pro">For</span>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-ink">
              <ModelLogo modelId={debater1Model} className="h-4 w-4" />
              <span>{MODEL_CONFIGS[debater1Model].name}</span>
            </div>
            <span className="mt-0.5 block text-xs text-ink-muted">{PERSONALITY_CONFIGS[debater1Personality].name}</span>
          </div>

          <div className="sm:text-right">
            <span className="text-sm font-semibold text-con">Against</span>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-ink sm:justify-end">
              <ModelLogo modelId={debater2Model} className="h-4 w-4" />
              <span>{MODEL_CONFIGS[debater2Model].name}</span>
            </div>
            <span className="mt-0.5 block text-xs text-ink-muted">{PERSONALITY_CONFIGS[debater2Personality].name}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1.5 text-sm text-ink-muted">
          <spicinessConfig.Icon className="h-3.5 w-3.5" />
          <span>{spicinessConfig.name}</span>
        </div>
      </header>

      <div className="space-y-8">
        {rounds.map((round, index) => (
          <div key={index} className="space-y-8">
            {round.debater1 && (
              <DebaterResponse position="For" model={debater1Model} personality={debater1Personality}>
                {round.debater1}
              </DebaterResponse>
            )}
            {round.debater2 && (
              <DebaterResponse position="Against" model={debater2Model} personality={debater2Personality}>
                {round.debater2}
              </DebaterResponse>
            )}
          </div>
        ))}

        {streamingText && (
          <DebaterResponse
            position={currentDebater === 'debater1' ? 'For' : 'Against'}
            model={currentModel}
            personality={currentDebater === 'debater1' ? debater1Personality : debater2Personality}
          >
            {streamingText}
          </DebaterResponse>
        )}

        <div ref={messagesEndRef} />
      </div>

      {displayError && (
        <div className="mt-8 border-l-2 border-con bg-surface-sunken px-4 py-3 text-sm text-ink">
          <span>{displayError.message}</span>
          {displayError.code === 'API_KEY_MISSING' && (
            <span className="mt-1 block text-xs text-ink-muted">Add a key from the settings icon in the header.</span>
          )}
        </div>
      )}

      {saveError && (
        <div className="mt-8 border-l-2 border-con bg-surface-sunken px-4 py-3 text-sm text-ink">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="mt-8 border-l-2 border-rule-strong bg-surface-sunken px-4 py-3 text-sm text-ink">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{saveSuccess}</span>
            <Button
              variant="secondary"
              onClick={() => {
                const debateId = saveSuccess.split('ID: ')[1];
                const url = `${window.location.origin}/debate/${debateId}`;
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
              }}
              className="gap-1.5 px-2 py-1"
              aria-label="Copy debate link"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </Button>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3 border-t border-rule pt-6">
        <Button
          onClick={handleNextRound}
          disabled={isLoading || streamingText !== null}
          isLoading={isStreamingLoading}
        >
          {isStreamingLoading ? 'Arguing...' : 'Next response'}
        </Button>
        <Button
          onClick={handleReset}
          variant="secondary"
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button
          onClick={handleOpenSaveModal}
          variant="secondary"
          disabled={isLoading || rounds.length === 0}
        >
          Save debate
        </Button>
      </div>

      <ConfirmSaveModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseSaveModal}
        onConfirm={handleConfirmSave}
        isSaving={isSaving}
      />
    </div>
  );
}