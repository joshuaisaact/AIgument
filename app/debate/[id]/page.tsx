import { Suspense } from 'react';
import SharedDebateView from '@/app/components/debate/SharedDebateView';
import { getDebate } from '@/app/lib/actions/debate';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DebatePage({ params }: PageProps) {
  const { id } = await params;
  const debate = await getDebate(id);

  if (!debate) {
    return (
      <main>
        <div className="mx-auto w-full max-w-2xl px-4 py-12">
          <h1 className="text-2xl font-semibold tracking-tight">Debate not found</h1>
          <p className="mt-2 text-ink-muted">
            The debate you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-ink-muted">Loading...</div>}>
        <SharedDebateView debate={debate} />
      </Suspense>
    </main>
  );
}