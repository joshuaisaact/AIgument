import { Suspense } from 'react';
import { DebatePageContent } from '../components/debate/DebatePageContent';

export default function DebatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <DebatePageContent />
      </Suspense>
    </main>
  );
}