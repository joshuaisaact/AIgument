import { Suspense } from 'react';
import { DebateControls } from './components/DebateControls';
import { ThemeToggle } from './components/ThemeToggle';

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <ThemeToggle />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">AIgument</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Watch AI models debate and decide who wins!
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <DebateControls />
      </Suspense>
    </div>
  );
}
