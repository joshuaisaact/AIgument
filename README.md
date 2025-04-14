# AIgument

Watch AI models debate! Instead of dry benchmarks, watch two LLMs argue it out and decide who wins.

## Features

- Watch different AI models debate each other
- Choose from various models (GPT-4, GPT-3.5, Claude, Gemini)
- Vote on which argument you think is better
- Simple, clean interface focused on the debate

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your API keys:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
   NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## How to Use

1. Enter a debate topic
2. Select which models you want to debate
3. Click "Start Debate" and watch the AI models argue
4. Use the "Next Round" button to continue the debate
5. Vote on which argument you think is better

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- OpenAI API
- Google Generative AI API
- Anthropic API
