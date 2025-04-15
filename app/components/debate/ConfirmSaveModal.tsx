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
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmSaveHeading"
    >
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close confirmation"
          disabled={isSaving}
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        <h2
          id="confirmSaveHeading"
          className="text-lg font-semibold mb-4 text-gray-900 dark:text-white"
        >
          Confirm Save
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
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