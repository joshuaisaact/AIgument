'use client';

import { useState, useEffect } from 'react';
import { clearApiKey, getApiKey, setApiKey, validateApiKeyFormat } from '../../lib/storage/apiKeyStorage';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveApiKeys } from '@/app/lib/actions/settings';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
    >
      {pending ? 'Saving...' : 'Save API Keys'}
    </button>
  );
}

export function ApiKeySettings({ isOpen, onClose }: ApiKeySettingsProps) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [state, formAction] = useActionState(saveApiKeys, { success: null, error: null });

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">API Key Settings</h2>
        <form action={formAction}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                name="openaiKey"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Anthropic API Key
              </label>
              <input
                type="password"
                name="anthropicKey"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Google API Key
              </label>
              <input
                type="password"
                name="googleKey"
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
          {state.error && (
            <p className="mt-4 text-red-500 text-sm">{state.error}</p>
          )}
          {state.success && (
            <p className="mt-4 text-green-500 text-sm">{state.success}</p>
          )}
        </form>
      </div>
    </div>
  );
}