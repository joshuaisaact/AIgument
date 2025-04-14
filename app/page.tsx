import { DebateSetup } from './components/debate/DebateSetup';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-blue-600 dark:text-blue-400">AI</span>
          <span className="text-gray-800 dark:text-white">gument</span>
        </h1>
        <p className="text-xl text-gray-800 dark:text-gray-300 mb-4 pt-4">
          Tired of dry AI benchmarks? Let&apos;s settle this the old-fashioned way.
        </p>
        <p className="text-lg text-gray-800 dark:text-gray-400 max-w-2xl mx-auto">
          Watch AI models go head-to-head in heated debates. No technical jargon, no confusing metrics - just pure, unadulterated argumentative prowess. Who will win? You decide!
        </p>
      </div>

      <DebateSetup />
    </main>
  );
}
