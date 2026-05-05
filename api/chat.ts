import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Call the Google Gemini API
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: "You are a helpful, friendly, and knowledgeable assistant for Darrang College. Answer questions about admissions, courses, fees, results, campus, and exams accurately.",
      messages,
    });

    // Respond with the stream
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

