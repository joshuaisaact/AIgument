"use client";

import { useState, useEffect } from "react";
import {
  getApiKey,
  clearApiKey,
  setApiKey,
} from "../../lib/storage/apiKeyStorage";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveApiKeys } from "@/app/lib/actions/settings";
import { X } from "lucide-react";
import Image from "next/image";

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
      className="cursor-pointer rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface transition-colors hover:opacity-90 disabled:opacity-40"
    >
      {pending ? "Saving..." : "Save keys"}
    </button>
  );
}

export function ApiKeySettings({ isOpen, onClose }: ApiKeySettingsProps) {
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [googleKey, setGoogleKey] = useState("");
  const [xaiKey, setXaiKey] = useState("");
  const [state, formAction] = useActionState(saveApiKeys, {
    success: null,
    error: null,
  });

  useEffect(() => {
    if (isOpen) {
      const storedOpenaiKey = getApiKey("openai");
      const storedAnthropicKey = getApiKey("anthropic");
      const storedGoogleKey = getApiKey("google");
      const storedXaiKey = getApiKey("xai");

      setOpenaiKey(storedOpenaiKey || "");
      setAnthropicKey(storedAnthropicKey || "");
      setGoogleKey(storedGoogleKey || "");
      setXaiKey(storedXaiKey || "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (state.validatedKeys) {
      if (state.validatedKeys.openaiKey) {
        setApiKey(state.validatedKeys.openaiKey, "openai");
      }
      if (state.validatedKeys.anthropicKey) {
        setApiKey(state.validatedKeys.anthropicKey, "anthropic");
      }
      if (state.validatedKeys.googleKey) {
        setApiKey(state.validatedKeys.googleKey, "google");
      }
      if (state.validatedKeys.xaiKey) {
        setApiKey(state.validatedKeys.xaiKey, "xai");
      }
    }
  }, [state.validatedKeys]);

  const handleClearKeys = () => {
    clearApiKey("openai");
    clearApiKey("anthropic");
    clearApiKey("google");
    clearApiKey("xai");
    setOpenaiKey("");
    setAnthropicKey("");
    setGoogleKey("");
    setXaiKey("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apiKeySettingsHeading"
    >
      <div className="relative w-full max-w-md rounded-md border border-rule bg-surface p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-md p-1 text-ink-muted transition-colors hover:text-ink"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <h2
          id="apiKeySettingsHeading"
          className="mb-2 text-lg font-semibold"
        >
          API keys
        </h2>
        <p className="mb-5 text-sm text-ink-muted">
          Keys are stored locally in your browser and never sent to our servers.
        </p>
        <form action={formAction}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="openaiKeyInput"
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                <Image
                  src="/openai.svg"
                  alt="OpenAI Logo"
                  width={20}
                  height={20}
                  className="mr-1.5 inline-block h-4 w-4 align-middle dark:invert"
                />
                OpenAI
              </label>
              <input
                id="openaiKeyInput"
                type="text"
                name="openaiKey"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-... (starts with sk-)"
                className="w-full rounded-md border border-rule bg-surface px-3 py-2 font-mono text-sm text-ink transition-colors placeholder:text-ink-muted/70 hover:border-rule-strong focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="anthropicKeyInput"
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                <Image
                  src="/anthropic.svg"
                  alt="Anthropic Logo"
                  width={20}
                  height={20}
                  className="mr-1.5 inline-block h-4 w-4 align-middle dark:invert"
                />
                Anthropic
              </label>
              <input
                id="anthropicKeyInput"
                type="text"
                name="anthropicKey"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-... (starts with sk-ant-)"
                className="w-full rounded-md border border-rule bg-surface px-3 py-2 font-mono text-sm text-ink transition-colors placeholder:text-ink-muted/70 hover:border-rule-strong focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="googleKeyInput"
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                <Image
                  src="/google.svg"
                  alt="Google Logo"
                  width={20}
                  height={20}
                  className="mr-1.5 inline-block h-4 w-4 align-middle"
                />
                Google
              </label>
              <input
                id="googleKeyInput"
                type="text"
                name="googleKey"
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
                placeholder="AIza... (starts with AIza)"
                className="w-full rounded-md border border-rule bg-surface px-3 py-2 font-mono text-sm text-ink transition-colors placeholder:text-ink-muted/70 hover:border-rule-strong focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="xaiKeyInput"
                className="mb-1.5 block text-sm font-medium text-ink-muted"
              >
                <Image
                  src="/xai.svg"
                  alt="xAI Logo"
                  width={20}
                  height={20}
                  className="mr-1.5 inline-block h-4 w-4 align-middle dark:invert"
                />
                xAI
              </label>
              <input
                id="xaiKeyInput"
                type="text"
                name="xaiKey"
                value={xaiKey}
                onChange={(e) => setXaiKey(e.target.value)}
                placeholder="gsk-... (starts with gsk_)"
                className="w-full rounded-md border border-rule bg-surface px-3 py-2 font-mono text-sm text-ink transition-colors placeholder:text-ink-muted/70 hover:border-rule-strong focus:border-ink focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-rule pt-5">
            <button
              type="button"
              onClick={handleClearKeys}
              className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-con transition-colors hover:bg-surface-sunken"
            >
              Clear keys
            </button>
            <SubmitButton />
          </div>
          {state.error && (
            <p className="mt-4 text-sm text-con">{state.error}</p>
          )}
          {state.success && (
            <p className="mt-4 text-sm text-ink-muted">{state.success}</p>
          )}
        </form>
      </div>
    </div>
  );
}
