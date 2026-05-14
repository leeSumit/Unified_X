'use client';

import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import type { ParsedModule, ArtifactType } from '@/lib/types';

interface Props {
  content: string;
  module: ParsedModule;
  artifactType: ArtifactType;
  heroImageUrl?: string | null;
}

function chipBg(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('project')) return '#E8681A';
  if (t.includes('case study')) return '#0D7377';
  if (t.includes('capstone') || t.includes('reflection')) return '#1A2550';
  if (t.includes('crossword') || t.includes('quiz') || t.includes('self-check')) return '#0D7377';
  return '#5B2D8E';
}

function buildHTML(markdown: string): string {
  const mermaidCodes: string[] = [];

  // Extract mermaid blocks before marked processes them
  const preprocessed = markdown.replace(/```mermaid\n?([\s\S]*?)```/g, (_, code) => {
    const idx = mermaidCodes.length;
    mermaidCodes.push(code.trim());
    // Wrap in a block-level div so marked passes it through as raw HTML
    return `\n\n<div class="ca-mermaid-ph" data-idx="${idx}"></div>\n\n`;
  });

  // Parse with default marked renderer
  let html = String(marked.parse(preprocessed));

  // --- Post-process: inject Campus AI inline styles ---

  // h2 section openers (must run before the generic tag replacements)
  html = html.replace(/<h2>([^<]*)<\/h2>/g, (_, text) => {
    const bg = chipBg(text);
    return `<div style="margin:32px 0 0;padding:14px 20px;background:${bg};border-radius:10px 10px 0 0;">`
      + `<h2 style="font-size:17px;font-weight:800;color:white;margin:0;letter-spacing:.2px;">${text}</h2>`
      + `</div><div style="height:3px;background:linear-gradient(90deg,${bg}cc,transparent);margin-bottom:16px;"></div>`;
  });

  html = html
    .replace(/<h1>/g, '<h1 style="font-size:26px;font-weight:800;color:#5B2D8E;margin:0 0 20px;line-height:1.25;">')
    .replace(/<h3>/g, '<h3 style="font-size:14px;font-weight:700;color:#1A2550;margin:20px 0 8px;padding-left:10px;border-left:3px solid #E8681A;">')
    .replace(/<h4>/g, '<h4 style="font-size:13px;font-weight:700;color:#5B2D8E;margin:14px 0 6px;">')
    .replace(/<blockquote>/g, '<blockquote style="background:#f3eeff;border-left:4px solid #5B2D8E;border-radius:0 8px 8px 0;padding:12px 16px;margin:14px 0;color:#3d1f6e;font-size:13.5px;line-height:1.65;">')
    .replace(/<pre><code/g, '<pre style="background:#1A1A2E;color:#e2e8f0;padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;line-height:1.6;margin:14px 0;"><code')
    .replace(/<table>/g, '<table style="width:100%;border-collapse:collapse;font-size:13px;margin:14px 0;border-radius:8px;overflow:hidden;">')
    .replace(/<th>/g, '<th style="padding:10px 14px;text-align:left;font-weight:700;background:#5B2D8E;color:white;">')
    .replace(/<td>/g, '<td style="padding:10px 14px;border-bottom:1px solid #f0eaf9;color:#2d3748;">')
    .replace(/<tr>/g, '<tr style="background:white;">')
    .replace(/<p>/g, '<p style="font-size:14px;line-height:1.75;color:#2d3748;margin:0 0 10px;">')
    .replace(/<ul>/g, '<ul style="margin:6px 0 14px;padding-left:22px;font-size:14px;line-height:1.75;color:#2d3748;">')
    .replace(/<ol>/g, '<ol style="margin:6px 0 14px;padding-left:22px;font-size:14px;line-height:1.75;color:#2d3748;">')
    .replace(/<li>/g, '<li style="margin-bottom:3px;">')
    .replace(/<hr>/g, '<hr style="border:none;border-top:1px solid #e2d9f3;margin:22px 0;" />')
    .replace(/<strong>/g, '<strong style="font-weight:700;color:#1A2550;">');

  // Replace mermaid placeholders with renderable divs
  mermaidCodes.forEach((code, idx) => {
    const encoded = encodeURIComponent(code);
    html = html.replace(
      `<div class="ca-mermaid-ph" data-idx="${idx}"></div>`,
      `<div class="ca-mermaid" data-code="${encoded}" `
      + `style="background:#f8f5ff;border:1px solid #ddd5f5;border-radius:8px;padding:20px;`
      + `margin:14px 0;min-height:100px;display:flex;align-items:center;justify-content:center;">`
      + `<span style="color:#9b8ab8;font-size:12px;">Loading diagram…</span></div>`
    );
  });

  return html;
}

export default function CampusAITemplate({ content, module, artifactType, heroImageUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (content) setHtml(buildHTML(content));
  }, [content]);

  useEffect(() => {
    if (!html || !containerRef.current) return;

    let cancelled = false;

    async function renderMermaid() {
      const mermaid = (await import('mermaid')).default;
      if (cancelled) return;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#5B2D8E',
          primaryTextColor: '#fff',
          primaryBorderColor: '#5B2D8E',
          lineColor: '#E8681A',
          secondaryColor: '#F5F0E8',
          tertiaryColor: '#0D7377',
          background: '#F5F0E8',
          mainBkg: '#5B2D8E',
          clusterBkg: '#f3eeff',
          titleColor: '#1A2550',
          edgeLabelBackground: '#F5F0E8',
        },
      });

      const blocks = containerRef.current!.querySelectorAll('.ca-mermaid[data-code]');
      for (let i = 0; i < blocks.length; i++) {
        if (cancelled) break;
        const block = blocks[i] as HTMLElement;
        const code = decodeURIComponent(block.getAttribute('data-code')!);
        try {
          const id = `ca-d-${i}-${Date.now()}`;
          const { svg } = await mermaid.render(id, code);
          block.innerHTML = svg;
          block.style.display = 'block';
          block.style.minHeight = '';
          block.style.padding = '16px';
        } catch {
          block.innerHTML = '<span style="color:#888;font-size:12px;">Diagram could not be rendered.</span>';
        }
      }
    }

    renderMermaid();
    return () => { cancelled = true; };
  }, [html]);

  const artifactLabel: Record<string, string> = { notes: 'Student Notes', pptx: 'PPTX Outline', workbook: 'Student Workbook' };

  return (
    <div style={{ background: '#F5F0E8', fontFamily: "'Inter', -apple-system, sans-serif", minHeight: '100%' }}>
      {/* Module header */}
      <div style={{ background: '#1A2550', padding: '20px 28px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#E8681A', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
              Campus AI
            </span>
            <span style={{ color: '#4a5568', fontSize: '10px' }}>·</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
              Sem {module.semester} · Module {module.module}
            </span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, background: '#5B2D8E', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>
              {artifactLabel[artifactType] ?? artifactType}
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.2 }}>
            {module.title}
          </h1>
          {module.topics.length > 0 && (
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0' }}>
              {module.topics.slice(0, 4).join(' · ')}
              {module.topics.length > 4 ? ` +${module.topics.length - 4} more` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Hero image */}
      {heroImageUrl && (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '16px 24px 0' }}>
          <img
            src={heroImageUrl}
            alt={module.title}
            style={{ width: '100%', borderRadius: '10px', display: 'block', maxHeight: '220px', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Content */}
      <div
        ref={containerRef}
        style={{ maxWidth: '780px', margin: '0 auto', padding: '24px 24px 48px' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
