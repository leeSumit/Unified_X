import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { ParsedModule } from '@/lib/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  const mime = file.type;

  // Mistral OCR — for PDF and image files
  if (
    process.env.MISTRAL_API_KEY &&
    (mime === 'application/pdf' || name.endsWith('.pdf') || mime.startsWith('image/'))
  ) {
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mime || 'application/pdf'};base64,${base64}`;

    const res = await fetch('https://api.mistral.ai/v1/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-ocr-latest',
        document: { type: 'document_url', document_url: dataUrl },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const pages: { markdown: string }[] = data.pages ?? [];
      return pages.map((p) => p.markdown).join('\n\n');
    }
  }

  // DOCX — mammoth
  if (mime.includes('wordprocessingml') || name.endsWith('.docx')) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  // PDF without Mistral — pdf-parse
  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    const pdfParse = await import('pdf-parse');
    const data = await pdfParse.default(buffer);
    return data.text;
  }

  // Plain text / markdown
  if (mime === 'text/plain' || name.endsWith('.txt') || name.endsWith('.md')) {
    return buffer.toString('utf-8');
  }

  throw new Error(
    `Cannot extract text from this file type (${mime || name}). Upload a PDF, DOCX, or TXT file, or paste the syllabus text instead.`
  );
}

async function parseModulesFromText(text: string): Promise<ParsedModule[]> {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Extract all modules from this syllabus document. For each module return a JSON object.

Rules:
- If semester/module numbers are not stated, infer them from the document order.
- If a field is not mentioned, use a sensible default (empty array, or infer from context).
- "topics" should be an array of chapter/topic titles — ideally 8–12 per module.
- "tools" should be AI tools explicitly mentioned or strongly implied by the module content.
- "indianCaseStudy" and "globalCaseStudy" should be company names only (e.g. "Freshworks", "Klarna").
- "learningOutcomes" should include Bloom's verb where possible (Remember/Understand/Apply/Analyse).
- "rawText" should be a 2–3 sentence summary of the module scope.

Return ONLY a valid JSON array — no prose, no markdown fences, just the raw JSON.

Schema for each element:
{
  "semester": number,
  "module": number,
  "title": string,
  "hours": number,
  "topics": string[],
  "tools": string[],
  "indianCaseStudy": string,
  "globalCaseStudy": string,
  "learningOutcomes": string[]
}

Syllabus:
${text.slice(0, 10000)}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response from parser');

  const raw = content.text.trim();
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('Could not extract module list from syllabus. Try pasting more structured text.');

  const modules: ParsedModule[] = JSON.parse(match[0]);
  if (!Array.isArray(modules) || modules.length === 0) {
    throw new Error('No modules found in the syllabus. Make sure the text includes module titles and topics.');
  }

  return modules;
}

export async function POST(request: NextRequest) {

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not set. Copy .env.local.example to .env.local and add your key.' },
        { status: 503 }
      );
    }

    const contentType = request.headers.get('content-type') ?? '';
    let text: string;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const pastedText = formData.get('text') as string | null;

      if (file && file.size > 0) {
        text = await extractTextFromFile(file);
      } else if (pastedText && pastedText.trim().length > 0) {
        text = pastedText;
      } else {
        return NextResponse.json({ error: 'No file or text provided.' }, { status: 400 });
      }
    } else {
      const body = await request.json();
      text = body.text ?? '';
    }

    if (!text || text.trim().length < 30) {
      return NextResponse.json(
        { error: 'Syllabus text is too short. Paste at least one full module description.' },
        { status: 400 }
      );
    }

    const modules = await parseModulesFromText(text);
    return NextResponse.json({ modules });
  } catch (error) {
    console.error('[parse]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse syllabus.' },
      { status: 500 }
    );
  }
}
