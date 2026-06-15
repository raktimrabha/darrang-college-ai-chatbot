import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { DARRANG_COLLEGE_KNOWLEDGE } from './src/data/darrang-knowledge.ts';
import { PDF_KNOWLEDGE } from './src/data/pdf-knowledge.ts';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

async function run() {
  const systemPrompt = `You are a helpful, friendly, and knowledgeable assistant for Darrang College. 
You MUST ONLY answer questions related to Darrang College based on the following Knowledge Base. 
If a user asks a question that is completely unrelated to Darrang College, politely decline to answer and state that you are only able to assist with inquiries related to the college.

Knowledge Base:
${DARRANG_COLLEGE_KNOWLEDGE}

Additional Document Context:
${PDF_KNOWLEDGE.map(doc => `[Document: ${doc.filename}]\n${doc.content}`).join('\n\n')}
`;
  
  console.log('Sending streamText request...');
  
  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: [{ role: 'user', content: [{ type: 'text', text: 'Hello' }] }] as any,
    });
    
    // Attempt to consume the stream to see if Google throws
    const reader = result.textStream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      process.stdout.write(value);
    }
    console.log('\nDone.');
  } catch (e) {
    console.error('Error calling streamText:', e);
  }
}

run();
