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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Saved Debates</h1>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          Browse recent debates saved by users. Saving a debate makes its topic publicly visible here.
        </p>

        {error && (
          <div className="p-4 mb-4 text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-300">
            Error loading debates: {error}
          </div>
        )}

        {!error && debates.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No debates have been saved yet.</p>
        )}

        {!error && debates.length > 0 && (
          <ul className="space-y-4">
            {debates.map((debate) => {
              const dateString = new Date(debate.created_at).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <li key={debate.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Link href={`/debate/${debate.id}`} className="block">
                    <div className="flex justify-between items-center mb-1">
                      <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate mr-4">
                        {debate.topic}
                      </h2>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {dateString}
                      </span>
                    </div>
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