import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/generation-prompts';
import type { ArtifactType, ParsedModule } from '@/lib/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      'ANTHROPIC_API_KEY is not set. Copy .env.local.example to .env.local and add your key.',
      { status: 503 }
    );
  }

  let module: ParsedModule;
  let artifactType: ArtifactType;

  try {
    const body = await request.json();
    module = body.module;
    artifactType = body.artifactType;
    if (!module || !artifactType) throw new Error('Missing module or artifactType');
  } catch {
    return new Response('Invalid request body', { status: 400 });
  }

  let prompt: string;
  try {
    prompt = buildPrompt(artifactType, module);
  } catch (err) {
    return new Response(
      err instanceof Error ? err.message : 'Failed to build prompt',
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 8000,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Generation failed';
        controller.enqueue(encoder.encode(`\n\n---\n\n**Error**: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    },
  });
}
