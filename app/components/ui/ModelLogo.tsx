"use client";

import { MODEL_CONFIGS } from '../../constants/debate';
import { ModelType } from '../../hooks/useModelProvider';
import Image from 'next/image';

interface ModelLogoProps {
  modelId: ModelType;
  className?: string;
}

export default function ModelLogo({ modelId, className = "h-4 w-4" }: ModelLogoProps) {
  // Ensure modelId exists in MODEL_CONFIGS
  if (!modelId || !MODEL_CONFIGS[modelId]) {
    return null; // or some fallback UI
  }

  const modelConfig = MODEL_CONFIGS[modelId];

  return (
    <>
      <Image
        src={modelConfig.logo}
        alt={modelConfig.alt}
        width={16}
        height={16}
        className={`${className} dark:hidden`}
      />
      <Image
        src={modelConfig.logo.replace('.svg', '-light.svg')}
        alt={modelConfig.alt}
        width={16}
        height={16}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}