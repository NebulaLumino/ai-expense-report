import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { system, messages } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
    const baseUrl = process.env.OPENAI_API_BASE_URL || 'https://api.deepseek.com/v1';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured. Set OPENAI_API_KEY in .env.local' }, { status: 500 });
    }

    const tools = [
      {
        type: 'function' as const,
        name: 'generate_document',
        description: 'Generate a detailed professional document based on user input',
        parameters: {
          type: 'object' as const,
          properties: {
            document_type: { type: 'string' as const, description: 'Type of document to generate' },
            content: { type: 'string' as const, description: 'The main content/prompt for document generation' },
          },
          required: ['document_type', 'content'],
        },
      }
    ];

    const openaiMessages = [
      { role: 'system', content: system || 'You are a helpful AI assistant.' },
      ...messages,
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: openaiMessages,
        tools,
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('AI API error:', response.status, errorData);
      return NextResponse.json({ error: `AI API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    if (message?.tool_calls?.length) {
      const toolResult = message.tool_calls[0];
      if (toolResult.function.name === 'generate_document') {
        return NextResponse.json({ result: toolResult.function.arguments });
      }
    }

    const content = message?.content || '';
    return NextResponse.json({ result: content });
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
