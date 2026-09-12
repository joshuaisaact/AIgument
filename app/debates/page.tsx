import { listDebates } from "@/app/lib/actions/debate";
import Link from "next/link";
import { ModelType } from "@/app/hooks/useModelProvider";

interface ListedDebate {
  id: string;
  topic: string;
  pro_model: ModelType;
  con_model: ModelType;
  created_at: string | Date;
}

export default async function DebatesListPage() {
  let debates: ListedDebate[] = [];
  let error: string | null = null;

  try {
    debates = await listDebates() as ListedDebate[];
  } catch (err) {
    console.error(err);
    error = err instanceof Error ? err.message : "Could not load debates.";
  }

  return (
    <main>
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Saved debates</h1>
        <p className="mt-2 mb-8 text-ink-muted">
          Recent debates saved by other readers. Saving a debate makes its topic
          publicly visible here.
        </p>

        {error && (
          <div className="mb-4 border-l-2 border-con bg-surface-sunken px-4 py-3 text-sm text-ink">
            Error loading debates: {error}
          </div>
        )}

        {!error && debates.length === 0 && (
          <p className="text-ink-muted">No debates have been saved yet.</p>
        )}

        {!error && debates.length > 0 && (
          <ul className="border-t border-rule">
            {debates.map((debate) => {
              const dateString = new Date(debate.created_at).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <li key={debate.id} className="border-b border-rule">
                  <Link
                    href={`/debate/${debate.id}`}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors hover:bg-surface-sunken"
                  >
                    <h2 className="truncate text-lg font-semibold text-ink group-hover:text-ink">
                      {debate.topic}
                    </h2>
                    <span className="shrink-0 text-xs whitespace-nowrap text-ink-muted">
                      {dateString}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}