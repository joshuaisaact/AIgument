'use client';

import { useState, useEffect } from 'react';
import { getApiKey, clearApiKey, setApiKey } from '../../lib/storage/apiKeyStorage';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveApiKeys } from '@/app/lib/actions/settings';
import { X } from 'lucide-react';
import Image from 'next/image';

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
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
    >
      {pending ? 'Saving...' : 'Save API Keys'}
    </button>
  );
}

export function ApiKeySettings({ isOpen, onClose }: ApiKeySettingsProps) {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [xaiKey, setXaiKey] = useState('');
  const [state, formAction] = useActionState(saveApiKeys, { success: null, error: null });

  useEffect(() => {
    if (isOpen) {
      const storedOpenaiKey = getApiKey('openai');
      const storedAnthropicKey = getApiKey('anthropic');
      const storedGoogleKey = getApiKey('google');
      const storedXaiKey = getApiKey('xai');

      setOpenaiKey(storedOpenaiKey || '');
      setAnthropicKey(storedAnthropicKey || '');
      setGoogleKey(storedGoogleKey || '');
      setXaiKey(storedXaiKey || '');
    }
  }, [isOpen]);

  useEffect(() => {
    if (state.validatedKeys) {
      console.log("Validated keys received, saving:", state.validatedKeys);
      if (state.validatedKeys.openaiKey) {
        setApiKey(state.validatedKeys.openaiKey, 'openai');
      }
      if (state.validatedKeys.anthropicKey) {
        setApiKey(state.validatedKeys.anthropicKey, 'anthropic');
      }
      if (state.validatedKeys.googleKey) {
        setApiKey(state.validatedKeys.googleKey, 'google');
      }
      if (state.validatedKeys.xaiKey) {
        setApiKey(state.validatedKeys.xaiKey, 'xai');
      }
    }
  }, [state.validatedKeys]);

  const handleClearKeys = () => {
    clearApiKey('openai');
    clearApiKey('anthropic');
    clearApiKey('google');
    clearApiKey('xai');
    setOpenaiKey('');
    setAnthropicKey('');
    setGoogleKey('');
    setXaiKey('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apiKeySettingsHeading"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <h2
          id="apiKeySettingsHeading"
          className="text-xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          API Key Settings
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Your API keys are stored locally in your browser and never sent to our servers.
        </p>
        <form action={formAction}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="openaiKeyInput"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                <Image src="/openai.svg" alt="OpenAI Logo" width={20} height={20} className="w-5 h-5 mr-2 inline-block align-middle dark:invert" />
                OpenAI API Key
              </label>
              <input
                id="openaiKeyInput"
                type="text"
                name="openaiKey"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-... (starts with sk-)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="anthropicKeyInput"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                <Image src="/anthropic.svg" alt="Anthropic Logo" width={20} height={20} className="w-5 h-5 mr-2 inline-block align-middle dark:invert" />
                Anthropic API Key
              </label>
              <input
                id="anthropicKeyInput"
                type="text"
                name="anthropicKey"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-... (starts with sk-ant-)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="googleKeyInput"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                <Image src="/google.svg" alt="Google Logo" width={20} height={20} className="w-5 h-5 mr-2 inline-block align-middle" />
                Google API Key
              </label>
              <input
                id="googleKeyInput"
                type="text"
                name="googleKey"
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                placeholder="AIza... (starts with AIza)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="xaiKeyInput"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                <Image src="/xai.svg" alt="xAI Logo" width={20} height={20} className="w-5 h-5 mr-2 inline-block align-middle dark:invert" />
                xAI API Key
              </label>
              <input
                id="xaiKeyInput"
                type="text"
                name="xaiKey"
                value={xaiKey}
                onChange={(e) => setXaiKey(e.target.value)}
                placeholder="gsk-... (starts with gsk_)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClearKeys}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 cursor-pointer"
            >
              Clear Keys
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