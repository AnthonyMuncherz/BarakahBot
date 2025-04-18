/**
 * Chat API Route Handler
 * 
 * This module implements the chat functionality for the ZakatBot using OpenRouter's API.
 * It processes incoming chat messages and returns AI-generated responses specifically
 * focused on Islamic topics like Zakat, Sadaqah, Waqf, and related Fiqh.
 * 
 * Environment Variables Required:
 * - OPENROUTER_API_KEY: API key for OpenRouter service
 * - NEXT_PUBLIC_SITE_URL: Site URL (defaults to http://localhost:3000)
 */

import { NextResponse } from 'next/server';

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'qwen/qwq-32b:free';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Define your site URL
const APP_TITLE = 'BarakahBot ZakatBot';

/**
 * POST request handler for the chat API endpoint.
 * 
 * @param {Request} req - The incoming HTTP request object
 * @returns {Promise<NextResponse>} JSON response containing either the AI's reply or error message
 * 
 * Expected Request Body:
 * {
 *   messages: Array<{
 *     role: 'user' | 'assistant' | 'system',
 *     content: string
 *   }>
 * }
 * 
 * Success Response:
 * {
 *   reply: string // The AI-generated response
 * }
 * 
 * Error Response:
 * {
 *   error: string // Error message
 *   status: number // HTTP status code
 * }
 */
export async function POST(req: Request) {
  console.log("Received chat request"); // Log request start
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not configured');
    return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    console.log("Request body parsed:", { messagesCount: messages?.length });

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
       console.warn('Invalid messages format received:', messages);
      return NextResponse.json({ error: 'Invalid or empty messages format' }, { status: 400 });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are ZakatBot, an AI assistant specialized in Islamic topics: Zakat, Sadaqah, Waqf, Nisab, and related Fiqh (jurisprudence) with specific focus on Malaysian context and standards.
      Your knowledge is strictly limited to these areas, with emphasis on Malaysian Islamic practices and regulations.
      Greet the user with "Assalamualaikum" ONLY in your very first response. Do NOT repeat greetings in subsequent messages.
      Answer questions accurately and concisely based on Islamic teachings, following Malaysian Islamic authorities like JAKIM and state religious departments.
      If a question is outside of these specific topics (e.g., general knowledge, other religions, politics, science, personal opinions), politely decline to answer and state that you can only discuss Zakat, Sadaqah, Waqf, and related Islamic matters.
      Use Malaysian Ringgit (RM) for all financial calculations and examples.

      *** VERY IMPORTANT FORMATTING RULE ***
      When you present information that includes multiple distinct points, definitions, or list items (e.g., explaining the key features of Waqf), you MUST separate each item with a single blank line.
      DO NOT put multiple points in the same paragraph block. Each point should be its own paragraph separated by a blank line.

      Correct Example:
      Feature 1: Explanation of feature 1.

      Feature 2: Explanation of feature 2.

      Feature 3: Explanation of feature 3.

      Incorrect Example (DO NOT DO THIS):
      Feature 1: Explanation. Feature 2: Explanation. Feature 3: Explanation.
      Incorrect Example (DO NOT DO THIS EITHER):
      Feature 1: Explanation.
      Feature 2: Explanation.
      Feature 3: Explanation.

      Follow this rule strictly to ensure readability.
      *** END FORMATTING RULE ***

      Do not engage in conversations unrelated to these specified Islamic topics.
      Keep your answers helpful and focused. Do not add unnecessary conversational filler or repeated sign-offs.`,
    };

    const messagesToSend = [systemPrompt, ...messages.filter(m => m.role === 'user' || m.role === 'assistant')]; // Ensure only valid roles are sent
    console.log(`Sending ${messagesToSend.length} messages to OpenRouter`);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': `${SITE_URL}/zakatbot`, // Identify the source page
        'X-Title': APP_TITLE, // Identify the application name
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messagesToSend,
      }),
    });
    
    console.log(`OpenRouter response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', response.status, errorText);
      return NextResponse.json({ error: `API request failed: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    console.log("OpenRouter response data:", JSON.stringify(data, null, 2)); // Log the full response

    const botMessageContent = data?.choices?.[0]?.message?.content;

    if (!botMessageContent) {
        console.error('Invalid response structure or empty content from OpenRouter:', data);
        return NextResponse.json({ error: 'Failed to extract valid response content from API' }, { status: 500 });
    }

    // Log the raw content received before sending
    console.log("--- RAW API RESPONSE CONTENT START ---");
    console.log(botMessageContent);
    console.log("--- RAW API RESPONSE CONTENT END ---");

    console.log("Extracted bot reply snippet:", botMessageContent.substring(0, 100) + "..."); // Log snippet of reply
    return NextResponse.json({ reply: botMessageContent });

  } catch (error: any) {
    console.error('Error processing chat request:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 