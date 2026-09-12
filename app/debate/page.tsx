import { Suspense } from 'react';
import { DebatePageContent } from '../components/debate/DebatePageContent';

export default function DebatePage() {
  return (
    <main>
      <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-ink-muted">Loading...</div>}>
        <DebatePageContent />
      </Suspense>
    </main>
  );
}