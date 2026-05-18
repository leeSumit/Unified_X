'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeInOverlay 180ms ease-out both',
      }}
    >
      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
        }
        .login-btn-google {
          width: 100%;
          background: #1a1a28;
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 24px;
          font-size: 15px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 150ms ease, border-color 150ms ease, transform 100ms ease;
        }
        .login-btn-google:hover {
          background: #1e1e30;
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }
        .login-btn-google:active { transform: translateY(0); }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#141420',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '36px 32px 32px',
          position: 'relative',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
          animation: 'slideUpModal 220ms ease-out both',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#8892a4',
            fontSize: 18,
            lineHeight: 1,
            transition: 'background 150ms ease, color 150ms ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
            (e.currentTarget as HTMLButtonElement).style.color = '#8892a4';
          }}
        >
          ×
        </button>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2
            style={{
              margin: '0 0 6px',
              fontSize: 22,
              fontWeight: 700,
              color: '#e2e8f0',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome back
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#8892a4' }}>
            Sign in to continue to UN<span style={{ color: '#f97316', fontWeight: 900 }}>AI</span>TED
          </p>
        </div>

        {/* Google button */}
        <button
          className="login-btn-google"
          style={{ opacity: loading ? 0.7 : 1 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleLogo />
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <p
          style={{
            margin: '20px 0 0',
            textAlign: 'center',
            fontSize: 13,
            color: '#4a5568',
          }}
        >
          A Google account is required to use UNAITED.
        </p>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087C16.6582 14.0525 17.64 11.8318 17.64 9.2045z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.5409-1.8368.8605-3.0477.8605-2.3441 0-4.3282-1.5832-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71c-.18-.5409-.2823-1.1182-.2823-1.71s.1023-1.1691.2823-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
        fill="#EA4335"
      />
    </svg>
  );
}

