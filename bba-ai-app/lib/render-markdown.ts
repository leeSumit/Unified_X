export function renderMarkdown(md: string): string {
  return md
    .replace(/^#### (.+)$/gm, '<h4 style="font-size:14px;font-weight:700;margin:14px 0 6px;">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:700;margin:18px 0 8px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:19px;font-weight:800;margin:24px 0 10px;border-bottom:2px solid #E9EBED;padding-bottom:6px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:800;margin:0 0 20px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#F2F3F3;padding:1px 5px;border-radius:2px;font-size:12px;">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #f97316;padding:8px 14px;color:#545B64;margin:12px 0;background:rgba(249,115,22,0.05);">$1</blockquote>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #E9EBED;margin:20px 0;" />')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:3px;font-size:14px;line-height:1.7;">$1</li>')
    .replace(/\n\n/g, '</p><p style="margin:0 0 10px;line-height:1.7;font-size:14px;">');
}
