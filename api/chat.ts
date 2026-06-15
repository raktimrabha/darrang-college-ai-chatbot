import { streamText, convertToModelMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { DARRANG_COLLEGE_KNOWLEDGE } from '../src/data/darrang-knowledge';
import { PDF_KNOWLEDGE } from '../src/data/pdf-knowledge';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize the Google provider with the user's GEMINI_API_KEY
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Call the Google Gemini API
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: `You are a helpful, friendly, and knowledgeable assistant for Darrang College. 
You MUST ONLY answer questions related to Darrang College based on the following Knowledge Base. 
If a user asks a question that is completely unrelated to Darrang College, politely decline to answer and state that you are only able to assist with inquiries related to the college.

Knowledge Base:
${DARRANG_COLLEGE_KNOWLEDGE}

Additional Document Context:
${PDF_KNOWLEDGE}
`,
      messages: await convertToModelMessages(messages),
    });


    // Respond with the structured message stream
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

