'use client';

interface Props {
  onNew: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  showBackToChat?: boolean;
  onBackToChat?: () => void;
}

export default function ChatHeader({ onNew, darkMode, onToggleDark, showBackToChat, onBackToChat }: Props) {
  const navBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 8,
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Left */}
      <div style={{ flex: 1 }}>
        {showBackToChat ? (
          <button style={navBtnStyle} onClick={onBackToChat}>
            ← Chat
          </button>
        ) : (
          <button style={navBtnStyle} onClick={onNew}>
            ← New
          </button>
        )}
      </div>

      {/* Center */}
      <div
        style={{
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--text-primary)',
          userSelect: 'none',
        }}
      >
        UNAITED
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{ ...navBtnStyle, fontSize: 18 }}
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          ◑
        </button>
      </div>
    </header>
  );
}
