'use server';

import { setApiKey, validateApiKeyFormat } from '../storage/apiKeyStorage';

interface SaveApiKeysState {
  success: string | null;
  error: string | null;
}

export async function saveApiKeys(
  prevState: SaveApiKeysState,
  formData: FormData
): Promise<SaveApiKeysState> {
  try {
    const openaiKey = formData.get('openaiKey') as string;
    const anthropicKey = formData.get('anthropicKey') as string;
    const googleKey = formData.get('googleKey') as string;

    // Save OpenAI key
    if (openaiKey) {
      if (!validateApiKeyFormat(openaiKey, 'openai')) {
        throw new Error('Invalid OpenAI API key format');
      }
      setApiKey(openaiKey, 'openai');
    }

    // Save Anthropic key
    if (anthropicKey) {
      if (!validateApiKeyFormat(anthropicKey, 'anthropic')) {
        throw new Error('Invalid Anthropic API key format');
      }
      setApiKey(anthropicKey, 'anthropic');
    }

    // Save Google key
    if (googleKey) {
      if (!validateApiKeyFormat(googleKey, 'google')) {
        throw new Error('Invalid Google API key format');
      }
      setApiKey(googleKey, 'google');
    }

    return { success: 'API keys saved successfully!', error: null };
  } catch (error) {
    return {
      success: null,
      error: error instanceof Error ? error.message : 'Failed to save API keys'
    };
  }
}