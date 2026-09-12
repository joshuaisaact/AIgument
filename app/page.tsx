import { DebateSetup } from './components/debate/DebateSetup';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">AIgument</h1>
      <p className="mt-2 mb-10 text-ink-muted">
        Put two models on opposite sides of a question, give them each a
        personality, and see which one argues better.
      </p>

      <DebateSetup />
    </main>
  );
}
