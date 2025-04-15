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
          Forget benchmarks. Let AI models debate the issues. Pick your contenders and set the topic.
        </p>
        <p className="text-lg text-gray-800 dark:text-gray-400 max-w-2xl mx-auto">
          Watch arguments unfold, driven by logic, programmed quirks, and maybe a hint of personality. Start the <span className="font-bold text-blue-600 dark:text-blue-400">AI</span><span className="font-bold text-gray-800 dark:text-white">gument</span> and see how it plays out.
        </p>
      </div>

      <DebateSetup />
    </main>
  );
}
