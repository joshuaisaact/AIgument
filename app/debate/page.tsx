import { DebatePageContent } from '../components/debate/DebatePageContent';

export default function DebatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <main className="container mx-auto px-4 py-8">
        <DebatePageContent />
      </main>
    </div>
  );
}