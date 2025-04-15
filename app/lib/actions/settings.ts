'use server';

import { validateApiKeyFormat } from '../storage/apiKeyStorage';

interface SaveApiKeysState {
  success: string | null;
  error: string | null;
  validatedKeys?: {
    openaiKey?: string;
    anthropicKey?: string;
    googleKey?: string;
    xaiKey?: string;
  };
}

export async function saveApiKeys(
  prevState: SaveApiKeysState,
  formData: FormData
): Promise<SaveApiKeysState> {
  try {
    const openaiKey = formData.get('openaiKey') as string;
    const anthropicKey = formData.get('anthropicKey') as string;
    const googleKey = formData.get('googleKey') as string;
    const xaiKey = formData.get('xaiKey') as string;

    const validatedKeys: SaveApiKeysState['validatedKeys'] = {};

    // Validate OpenAI key
    if (openaiKey) {
      if (!validateApiKeyFormat(openaiKey, 'openai')) {
        throw new Error('Invalid OpenAI API key format');
      }
      validatedKeys.openaiKey = openaiKey;
    }

    // Validate Anthropic key
    if (anthropicKey) {
      if (!validateApiKeyFormat(anthropicKey, 'anthropic')) {
        throw new Error('Invalid Anthropic API key format');
      }
      validatedKeys.anthropicKey = anthropicKey;
    }

    // Validate Google key
    if (googleKey) {
      if (!validateApiKeyFormat(googleKey, 'google')) {
        throw new Error('Invalid Google API key format');
      }
      validatedKeys.googleKey = googleKey;
    }

    // Validate xAI key
    if (xaiKey) {
      if (!validateApiKeyFormat(xaiKey, 'xai')) {
        throw new Error('Invalid xAI API key format');
      }
      validatedKeys.xaiKey = xaiKey;
    }

    return {
      success: 'API keys validated successfully!',
      error: null,
      validatedKeys
    };
  } catch (error) {
    return {
      success: null,
      error: error instanceof Error ? error.message : 'Failed to validate API keys'
    };
  }
}