import { NextRequest, NextResponse } from 'next/server';
import type { ParsedModule, ArtifactType } from '@/lib/types';

const ARTIFACT_LABEL: Record<ArtifactType, string> = {
  notes: 'Notes',
  pptx: 'PPTX Outline',
  workbook: 'Workbook',
};

export async function POST(request: NextRequest) {
  const daemonUrl = (process.env.OPEN_DESIGN_DAEMON_URL ?? 'http://localhost:7456').replace(/\/$/, '');
  const webUrl = (process.env.OPEN_DESIGN_WEB_URL ?? 'http://localhost:3000').replace(/\/$/, '');

  let module: ParsedModule;
  let artifactType: ArtifactType;
  let content: string;

  try {
    const body = await request.json();
    module = body.module;
    artifactType = body.artifactType;
    content = body.content ?? '';
    if (!module || !artifactType) throw new Error('Missing module or artifactType');
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const projectName = `${module.title} — ${ARTIFACT_LABEL[artifactType]}`;

  // Build the pending prompt that Open Design will fire when the project opens.
  // We inject the first 4000 chars of generated content so the agent has context.
  const contentSnippet = content.slice(0, 4000);
  const pendingPrompt = [
    `Apply the campus-ai-workbook template to lay out the following Campus AI content.`,
    `Use the Campus AI design system (design-systems/campus-ai).`,
    ``,
    `Module: ${module.title} (Semester ${module.semester}, Module ${module.module})`,
    `Artifact type: ${ARTIFACT_LABEL[artifactType]}`,
    ``,
    `Generated content to render:`,
    `---`,
    contentSnippet,
    contentSnippet.length < content.length ? `\n[... content truncated — full content was ${content.length} characters ...]` : '',
  ].join('\n');

  // Attempt to create a project in the Open Design daemon
  let projectId: string | null = null;
  let daemonReachable = false;

  try {
    const res = await fetch(`${daemonUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: projectName,
        skillId: 'campus-ai-workbook',
        designSystemId: 'campus-ai',
        pendingPrompt,
        metadata: { kind: 'prototype' },
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      projectId = data.project?.id ?? null;
      daemonReachable = true;
    } else {
      // Daemon is running but returned an error — still reachable
      daemonReachable = true;
    }
  } catch {
    // Daemon not running — fall back to instructions
    daemonReachable = false;
  }

  return NextResponse.json({
    daemonReachable,
    projectId,
    webUrl,
    // The URL the user should open to see their project
    openUrl: projectId ? `${webUrl}` : null,
    instructions: daemonReachable
      ? null
      : `Open Design daemon is not running. Start it with: cd open-design && pnpm tools-dev`,
  });
}
