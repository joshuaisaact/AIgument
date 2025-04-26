import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CoreMessage, streamText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("[API /gemini-flash] Error: Google API key not configured.");
    return new Response(
      JSON.stringify({
        error: "Google API key not configured on server for Gemini 2.5 Flash.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();

    const result = await streamText({
      model: google("gemini-2.5-flash-preview-04-17"),
      prompt: messages.find((m) => m.role === "system")?.content ?? "",
    });

    return new Response(result.textStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[API /gemini-flash] Error in try block:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Optional: Add edge runtime compatibility if needed
// export const runtime = 'edge';
