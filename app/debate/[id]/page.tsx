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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Debate not found</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The debate you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <SharedDebateView debate={debate} />
      </Suspense>
    </main>
  );
}