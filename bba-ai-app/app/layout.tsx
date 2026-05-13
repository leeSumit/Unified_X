import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Campus AI — Content Generation Studio',
  description:
    'Generate BBA AI module content — Notes, PPTX, and Workbook — in the exact Campus AI teacher-voice and style.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
