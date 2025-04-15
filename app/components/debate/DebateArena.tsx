"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import DebaterResponse from './DebaterResponse';
import { useModelProvider, ModelType } from '../../hooks/useModelProvider';
import { SpicinessLevel } from '../ui/SpicinessSelector';
import { useDebateState } from '../../hooks/useDebateState';
import { useDebateStreaming } from '../../hooks/useDebateStreaming';
import { Button } from '../ui/Button';
import { saveDebate } from '../../lib/actions/debate';
import { MODEL_CONFIGS } from '../../constants/debate';
import Image from 'next/image';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { PERSONALITY_CONFIGS, PersonalityId, SPICINESS_CONFIGS } from "@/app/constants";
import { ConfirmSaveModal } from './ConfirmSaveModal';

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
  }, [rounds, topic, debater1Model, debater2Model, spiciness]);

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{topic}</h1>
        <div className="mt-2 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Image
              src={MODEL_CONFIGS[debater1Model].logo}
              alt={MODEL_CONFIGS[debater1Model].alt}
              width={20}
              height={20}
              className="w-5 h-5 dark:invert dark:opacity-80"
            />
            <span>For: {MODEL_CONFIGS[debater1Model].name} ({PERSONALITY_CONFIGS[debater1Personality].name})</span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={MODEL_CONFIGS[debater2Model].logo}
              alt={MODEL_CONFIGS[debater2Model].alt}
              width={20}
              height={20}
              className="w-5 h-5 dark:invert dark:opacity-80"
            />
            <span>Against: {MODEL_CONFIGS[debater2Model].name} ({PERSONALITY_CONFIGS[debater2Personality].name})</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-1">Intensity: {SPICINESS_CONFIGS[spiciness].level_descriptor}</p>
      </div>

      <div className="space-y-6">
        {rounds.map((round, index) => (
          <div key={index} className="space-y-4">
            {round.debater1 && (
              <DebaterResponse position="For" model={debater1Model}>
                {round.debater1}
              </DebaterResponse>
            )}
            {round.debater2 && (
              <DebaterResponse position="Against" model={debater2Model}>
                {round.debater2}
              </DebaterResponse>
            )}
          </div>
        ))}

        {streamingText && (
          <DebaterResponse
            position={currentDebater === 'debater1' ? 'For' : 'Against'}
            model={currentModel}
          >
            {streamingText}
          </DebaterResponse>
        )}

        <div ref={messagesEndRef} />
      </div>

      {displayError && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {displayError.message}
        </div>
      )}

      {saveError && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{saveSuccess}</span>
            <Button
              variant="secondary"
              onClick={() => {
                const debateId = saveSuccess.split('ID: ')[1];
                const url = `${window.location.origin}/debate/${debateId}`;
                navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
              }}
              className="ml-2 px-2 py-1 text-sm"
              aria-label="Copy debate link"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy Link
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <Button
          onClick={handleNextRound}
          disabled={isLoading || streamingText !== null}
          isLoading={isStreamingLoading}
        >
          {isStreamingLoading ? 'Debating...' : 'Next Response'}
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
          Save Debate
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