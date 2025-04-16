"use client";

import { MODEL_CONFIGS } from '../../constants/models';
import { ModelType } from '../../hooks/useModelProvider';
import Image from 'next/image';

interface ModelLogoProps {
  modelId: ModelType;
  className?: string;
}

export default function ModelLogo({ modelId, className = "h-4 w-4" }: ModelLogoProps) {
  if (!modelId || !MODEL_CONFIGS[modelId]) {
    return null;
  }

  const modelConfig = MODEL_CONFIGS[modelId];
  const isGrokModel = modelId === 'grok-3' || modelId === 'grok-3-mini';

  if (isGrokModel) {
    return (
      <Image
        src={modelConfig.logo}
        alt={modelConfig.alt}
        width={16}
        height={16}
        className={`${className} dark:invert`}
      />
    );
  } else {
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
}