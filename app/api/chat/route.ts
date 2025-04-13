import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

type Model = "claude" | "gpt4" | "gpt35" | "gemini";

const getModelProvider = (model: Model) => {
  switch (model) {
    case "claude":
      return anthropic("claude-3-sonnet");
    case "gpt4":
      return openai("gpt-4-turbo");
    case "gpt35":
      return openai("gpt-3.5-turbo");
    case "gemini":
      return google('gemini-1.5-flash');
    default:
      throw new Error(`Unknown model: ${model}`);
  }
};

export async function POST(req: Request) {
  const { messages, role, topic, model, round, position, previousArguments } = await req.json();

  // Get the other debater's messages
  const otherDebaterRole = role === 'debater1' ? 'debater2' : 'debater1';
  const otherDebaterMessages = messages.filter((m: any) => m.role === otherDebaterRole);

  const systemPrompt = role === 'debater1'
    ? `You are Debater 1 in a debate about "${topic}". You are taking the PRO position.
       This is round ${round} of the debate. Be persuasive, use logical arguments, and respond to Debater 2's points when they make them.
       Keep your responses concise and focused.${previousArguments ? `
       Your previous argument: ${previousArguments.self}
       Your opponent's previous argument: ${previousArguments.opponent}` : ''}`
    : `You are Debater 2 in a debate about "${topic}". You are taking the CON position.
       This is round ${round} of the debate. Be persuasive, use logical arguments, and respond to Debater 1's points when they make them.
       Keep your responses concise and focused.${previousArguments ? `
       Your previous argument: ${previousArguments.self}
       Your opponent's previous argument: ${previousArguments.opponent}` : ''}`;

  const result = streamText({
    model: getModelProvider(model as Model),
    system: systemPrompt,
    messages: [
      ...messages,
      {
        role: 'system',
        content: `Here are the other debater's recent points: ${otherDebaterMessages.map((m: any) => m.content).join('\n')}`
      }
    ],
  });

  return result.toDataStreamResponse();
}