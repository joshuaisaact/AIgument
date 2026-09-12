"use client";

import { Button } from "../ui/Button";
import { X } from "lucide-react";

interface ConfirmSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

export function ConfirmSaveModal({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
}: ConfirmSaveModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmSaveHeading"
    >
      <div className="relative w-full max-w-md rounded-md border border-rule bg-surface p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-md p-1 text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
          aria-label="Close confirmation"
          disabled={isSaving}
        >
          <X className="h-4 w-4" />
        </button>
        <h2
          id="confirmSaveHeading"
          className="mb-2 text-lg font-semibold"
        >
          Confirm save
        </h2>
        <p className="mb-6 text-sm text-ink-muted">
          Saving this debate will make its topic publicly visible on the &apos;Browse Debates&apos; page. Are you sure you want to proceed?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSaving}
            isLoading={isSaving}
          >
            {isSaving ? "Saving..." : "Confirm & Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}