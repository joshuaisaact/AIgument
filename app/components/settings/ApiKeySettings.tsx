'use client';

import { useState, useEffect } from 'react';
import { clearApiKey, getApiKey, setApiKey, validateApiKeyFormat } from '../../lib/storage/apiKeyStorage';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeySettings({ isOpen, onClose }: ApiKeySettingsProps) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedOpenaiKey = getApiKey('openai');
      const storedAnthropicKey = getApiKey('anthropic');
      const storedGoogleKey = getApiKey('google');

      if (storedOpenaiKey) setOpenaiKey(storedOpenaiKey);
      if (storedAnthropicKey) setAnthropicKey(storedAnthropicKey);
      if (storedGoogleKey) setGoogleKey(storedGoogleKey);
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsChecking(true);
    setError(null);
    setSuccess(null);

    try {
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

      setSuccess('API keys saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API keys');
    } finally {
      setIsChecking(false);
    }
  };

  const handleClear = () => {
    clearApiKey('openai');
    clearApiKey('anthropic');
    clearApiKey('google');
    setOpenaiKey('');
    setAnthropicKey('');
    setGoogleKey('');
    setSuccess('API keys cleared successfully!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">API Key Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <input
              type="text"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Anthropic API Key
            </label>
            <input
              type="text"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Google API Key
            </label>
            <input
              type="text"
              value={googleKey}
              onChange={(e) => setGoogleKey(e.target.value)}
              placeholder="AIza..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Your API keys are stored locally in your browser and never sent to our server.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
            {success}
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Clear All
          </button>
          <button
            onClick={handleSave}
            disabled={isChecking}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isChecking ? 'Saving...' : 'Save Keys'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}