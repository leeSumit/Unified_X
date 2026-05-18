import { NextRequest } from 'next/server';
import { buildPrompt } from '@/lib/generation-prompts';
import type { ArtifactType, ParsedModule } from '@/lib/types';
export async function POST(request: NextRequest) {
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

  // Try OpenRouter first (reliable on Vercel), fall back to Anthropic direct
  async function fetchUpstream(): Promise<ReadableStream<Uint8Array>> {
    if (process.env.OPENROUTER_API_KEY) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://unaited.vercel.app',
          'X-Title': 'UNAITED',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4-6',
          max_tokens: 64000,
          stream: true,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (res.ok && res.body) return res.body;
    }
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('No API key configured');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 64000,
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok || !res.body) throw new Error(`Anthropic ${res.status}`);
    return res.body;
  }

  let upstream: ReadableStream<Uint8Array>;
  try {
    upstream = await fetchUpstream();
  } catch (err) {
    return new Response(
      err instanceof Error ? err.message : 'Generation failed',
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Parse SSE from upstream and emit only the text deltas
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader();
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              // OpenRouter / OpenAI format
              const oaiDelta = parsed?.choices?.[0]?.delta?.content;
              if (typeof oaiDelta === 'string') {
                controller.enqueue(encoder.encode(oaiDelta));
                continue;
              }
              // Anthropic direct SSE format
              if (parsed?.type === 'content_block_delta' && typeof parsed?.delta?.text === 'string') {
                controller.enqueue(encoder.encode(parsed.delta.text));
              }
            } catch { /* skip malformed lines */ }
          }
        }
      } catch { /* client disconnected or aborted */ } finally {
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
