type Provider = 'openai' | 'anthropic' | 'google';

const getStorageKey = (provider: Provider) => `${provider}-api-key`;

export const setApiKey = (key: string, provider: Provider) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getStorageKey(provider), key);
  }
};

export const getApiKey = (provider: Provider) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(getStorageKey(provider));
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
    default:
      return false;
  }
};