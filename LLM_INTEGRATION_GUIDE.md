# How to Connect an LLM to Your Chatbot

Right now, your chatbot's frontend sends a request to `/api/chat` (as seen in `src/utils/api.ts`), but there is no real backend answering it.

To make the chatbot actually "think" and reply, you need to connect it to a Large Language Model (LLM) like OpenAI (ChatGPT), Google Gemini, or Anthropic (Claude).

Here are the two ways you can do this, starting with the **highly recommended** secure method.

---

## Method 1: Vercel Serverless Function (Recommended & Secure)

Since your frontend is already hosted on Vercel, you can easily create a backend right inside this project using **Vercel Serverless Functions**. This is the best way because your API key stays safely hidden on the server.

### Step 1: Install the AI SDK
Vercel has an amazing library called `ai` that makes talking to LLMs incredibly easy. Run this in your terminal:
```bash
npm install ai @ai-sdk/openai
```
*(Note: If you prefer Gemini or Claude, you can install `@ai-sdk/google` or `@ai-sdk/anthropic` instead).*

### Step 2: Create the API Route
In the root folder of your project (the same place as `package.json`), create a new folder named `api`, and inside it, create a file named `chat.ts`.
**File path:** `api/chat.ts`

Paste the following code into `api/chat.ts`:
```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Call the OpenAI API
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: "You are a helpful, friendly, and knowledgeable assistant for Darrang College. Answer questions about admissions, courses, fees, and campus life accurately.",
    messages,
  });

  // Respond with the stream
  return result.toDataStreamResponse();
}
```

### Step 3: Add your API Key
You need to provide your OpenAI API key so the server can authenticate.
1. Create a file named `.env` in the root of your project.
2. Add your key inside:
   ```env
   OPENAI_API_KEY=your_actual_api_key_here
   ```
3. **IMPORTANT**: Go to your Vercel Dashboard -> Settings -> Environment Variables, and add `OPENAI_API_KEY` there as well.

### Step 4: Update the Frontend API Call
Right now, `src/utils/api.ts` expects a simple JSON string back. If you use the AI SDK above, you'll need to update your frontend to handle the streaming response.

The easiest way to do this is to replace `useChat.ts` with the built-in `useChat` hook from the `ai/react` library:

```typescript
// Inside your ChatPage.tsx
import { useChat } from '@ai-sdk/react';

export function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  });
  
  // ... update your UI to use these new props
}
```

---

## Method 2: Direct Frontend Call (Insecure - Prototyping Only)

> [!CAUTION]
> **Do not use this in production!** If you put your API key in the frontend, anyone who visits your website can see your key and use it to run up your billing.

If you just want to test it locally right now without setting up an API route, you can call OpenAI directly from `src/utils/api.ts`.

### Step 1: Add your key to Vite
Create a `.env` file at the root:
```env
VITE_OPENAI_API_KEY=your_api_key_here
```

### Step 2: Modify `src/utils/api.ts`
Replace your existing `api.ts` with this:

```typescript
export type ChatHistoryItem = { role: "user" | "assistant" | "system"; content: string };

export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[],
  signal?: AbortSignal,
): Promise<string> {
  
  const messages = [
    { role: "system", content: "You are a helpful assistant for Darrang College." },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: message }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: messages,
    }),
    signal,
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
```

## Next Steps

I strongly suggest going with **Method 1**. Vercel makes it incredibly easy to host Serverless Functions in the `/api` directory right alongside your React frontend. 

If you'd like me to automatically implement Method 1 for you, just provide your preferred AI provider (OpenAI, Google Gemini, Anthropic) and I will rewrite `src/utils/api.ts`, update `useChat.ts`, and set up the `/api` backend endpoint for you!
