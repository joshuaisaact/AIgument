import { useDebateState } from '../hooks/useDebateState';
import { useDebateStreaming } from '../hooks/useDebateStreaming';
import { SpicinessLevel } from './ui/SpicinessSelector';
import { ModelType, useModelProvider } from '../hooks/useModelProvider';

interface DebateRoomProps {
  topic: string;
  debater1: ModelType;
  debater2: ModelType;
  spiciness: SpicinessLevel;
}

export function DebateRoom({ topic, debater1, debater2, spiciness }: DebateRoomProps) {
  const {
    rounds,
    currentRound,
    currentDebater,
    isLoading,
    error,
    handleResponseComplete,
    resetDebate
  } = useDebateState({ topic, debater1, debater2, spiciness });

  const { getModelProvider } = useModelProvider();

  const { startStreaming } = useDebateStreaming({
    topic,
    debater1,
    debater2,
    currentRound,
    currentDebater,
    rounds,
    spiciness,
    onResponseComplete: handleResponseComplete
  });

  const handleStartDebate = async () => {
    await startStreaming(getModelProvider);
  };

  // ... existing code ...
}