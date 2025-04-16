# AIgument

Watch AI models debate! Instead of dry benchmarks, watch two LLMs argue it out and decide who wins.

![AIgument Preview](https://aigument.vercel.app/aigument-preview.png)

## Features

- Watch different AI models debate each other
- Choose from various models (e.g., GPT-4o, Claude 3 Sonnet, Gemini 1.5 Flash, Grok 3, Grok 3 Mini)
- Assign unique personalities to each debater (e.g., Pirate, Butler, Sassy Drag Queen, etc.)
- Control the "spiciness" or intensity of the debate
- Vote on which argument you think is better
- Browse and view previously saved debates
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
   NEXT_PUBLIC_XAI_API_KEY=your_xai_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## How to Use

1. Enter a debate topic
2. Select the models for each debater
3. Assign a personality to each debater
4. Choose the desired "spiciness" level
5. Click "Start AIgument" and watch the debate unfold
6. Use the "Next Round" button to continue
7. Vote on which argument you think is better
8. (Optional) Save the debate to view later

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- OpenAI API
- Google Generative AI API
- Anthropic API
- xAI API
