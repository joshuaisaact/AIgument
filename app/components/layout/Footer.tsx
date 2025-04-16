import Image from 'next/image';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      <div className="container mx-auto px-4">
        <span className="mr-2">© {new Date().getFullYear()} AIgument</span>
        <span className="mx-2">|</span>
        <a
          href="https://github.com/joshuaisaact/AIgument"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >

          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={16}
            height={16}
            className="w-4 h-4 dark:invert"
          />
        </a>
        <span className="mx-2">|</span>
        <span>Built by Joshua Tuddenham</span>
      </div>
    </footer>
  );
}