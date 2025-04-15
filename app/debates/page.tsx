import { listDebates } from "@/app/lib/actions/debate";
import Link from "next/link";
import { MODEL_CONFIGS } from "@/app/constants/debate";
// import { formatDistanceToNow } from 'date-fns'; // Removed for now
import { ModelType } from "@/app/hooks/useModelProvider"; // Import ModelType

// Define the expected shape of a listed debate
interface ListedDebate {
  id: string;
  topic: string;
  pro_model: ModelType;
  con_model: ModelType;
  created_at: string | Date; // Allow string or Date
}

export default async function DebatesListPage() {
  // Explicitly type the debates array
  let debates: ListedDebate[] = [];
  let error: string | null = null;

  try {
    // Cast the result to ensure type safety
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
            {/* Explicitly type `debate` in the map function if needed, though inference should work now */}
            {debates.map((debate) => {
              // Types should now be inferred correctly from ListedDebate[]
              const proModelConfig = MODEL_CONFIGS[debate.pro_model];
              const conModelConfig = MODEL_CONFIGS[debate.con_model];
              // Display simple date string instead of relative time
              const dateString = new Date(debate.created_at).toLocaleDateString();

              return (
                <li key={debate.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Link href={`/debate/${debate.id}`} className="block">
                    <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400 hover:underline">
                      {debate.topic}
                    </h2>
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2 mb-1 sm:mb-0">
                        <span className="font-medium">For:</span>
                        {proModelConfig && <img src={proModelConfig.logo} alt="" className="w-3 h-3 dark:invert dark:opacity-80" />}
                        <span>{proModelConfig?.name || debate.pro_model}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1 sm:mb-0">
                        <span className="font-medium">Against:</span>
                         {conModelConfig && <img src={conModelConfig.logo} alt="" className="w-3 h-3 dark:invert dark:opacity-80" />}
                         <span>{conModelConfig?.name || debate.con_model}</span>
                      </div>
                      {/* Use simple date string */}
                      <span className="flex-shrink-0">{dateString}</span>
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