'use client';

import Link from 'next/link';
import { ApiKeySettings } from '../settings/ApiKeySettings';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import Image from 'next/image';
import { Library } from 'lucide-react';

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b border-rule bg-surface">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-semibold text-ink transition-colors hover:text-ink">
            <span className="text-ink">AI</span>gument
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/debates"
              className="rounded-md p-2 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
              aria-label="View Saved Debates"
              title="View Saved Debates"
            >
              <Library className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com/joshuaisaact/AIgument"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 transition-colors hover:bg-surface-sunken"
              aria-label="GitHub Repository"
            >
              <Image
                src="/github.svg"
                alt="GitHub Logo"
                width={24}
                height={24}
                className="h-5 w-5 opacity-70 dark:invert"
              />
            </a>
            <ThemeToggle />
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="cursor-pointer rounded-md p-2 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
              aria-label="Settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <ApiKeySettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}