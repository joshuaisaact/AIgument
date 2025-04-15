type Provider = 'openai' | 'anthropic' | 'google' | 'xai';

const getStorageKey = (provider: Provider) => `${provider}-api-key`;

export const setApiKey = (key: string, provider: Provider) => {
  if (typeof window !== 'undefined') {
    const storageKey = getStorageKey(provider);
    console.log(`Setting ${provider} API key:`, storageKey, key);
    localStorage.setItem(storageKey, key);
  }
};

export const getApiKey = (provider: Provider) => {
  if (typeof window !== 'undefined') {
    const storageKey = getStorageKey(provider);
    const key = localStorage.getItem(storageKey);
    console.log(`Getting ${provider} API key:`, storageKey, key);
    return key;
  }
  return null;
};

export const clearApiKey = (provider: Provider) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getStorageKey(provider));
  }
};

export const validateApiKeyFormat = (key: string, provider: Provider) => {
  switch (provider) {
    case 'openai':
      return /^sk-[A-Za-z0-9]{32,}$/.test(key);
    case 'anthropic':
      return /^sk-ant-[A-Za-z0-9]{32,}$/.test(key);
    case 'google':
      return /^AIza[A-Za-z0-9_-]{35,}$/.test(key);
    case 'xai':
      return /^gsk_[A-Za-z0-9]{60}$/.test(key);
    default:
      return false;
  }
};