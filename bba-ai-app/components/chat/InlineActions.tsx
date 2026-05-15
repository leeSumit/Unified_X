'use client';

import { useState } from 'react';
import type { ArtifactType, ParsedModule } from '@/lib/types';
import { renderMarkdown } from '@/lib/render-markdown';

interface Props {
  content: string;
  artifactType: ArtifactType;
  module: ParsedModule;
}

const btnStyle: React.CSSProperties = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 20,
  padding: '5px 14px',
  fontSize: 13,
  cursor: 'pointer',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

export default function InlineActions({ content, artifactType, module }: Props) {
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleDownloadPDF() {
    setPdfGenerating(true);
    try {
      const filename = `${module.title.toLowerCase().replace(/\s+/g, '-')}-${artifactType}.pdf`;
      const html2pdf = (await import('html2pdf.js')).default;
      const div = document.createElement('div');
      div.style.cssText = 'font-family:Inter,sans-serif;font-size:14px;line-height:1.7;padding:40px;color:#16191F;max-width:800px;';
      div.innerHTML = renderMarkdown(content);
      document.body.appendChild(div);
      await html2pdf()
        .set({ margin: 10, filename, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' } })
        .from(div)
        .save();
      document.body.removeChild(div);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfGenerating(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        marginTop: 12,
        flexWrap: 'wrap',
        animation: 'fadeIn 300ms ease-out',
      }}
    >
      <button style={btnStyle} onClick={handleCopy}>
        {copied ? '✓ Copied' : '📋 Copy'}
      </button>
      <button style={btnStyle} onClick={handleDownloadPDF} disabled={pdfGenerating}>
        {pdfGenerating ? '⏳ Generating…' : '⬇ Download PDF'}
      </button>
    </div>
  );
}
