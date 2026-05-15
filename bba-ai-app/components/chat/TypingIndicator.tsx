'use client';

interface Props {
  visible: boolean;
}

export default function TypingIndicator({ visible }: Props) {
  if (!visible) return null;

  return (
    <div
      style={{
        alignSelf: 'flex-start',
        padding: '12px 16px',
        background: 'var(--bg-ai-bubble)',
        borderRadius: 'var(--chat-bubble-radius-ai)',
        boxShadow: 'var(--shadow-card)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        opacity: 1,
        transition: 'opacity 150ms ease',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--text-muted)',
            display: 'inline-block',
            animation: `typingDot 1.2s ease-in-out infinite`,
            animationDelay: `${i * 200}ms`,
          }}
        />
      ))}
    </div>
  );
}
