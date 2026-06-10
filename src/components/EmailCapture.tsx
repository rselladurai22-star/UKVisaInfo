'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  /** Heading line — short */
  title?: string;
  /** Subline — what they get */
  subtitle?: string;
  /** Button label */
  cta?: string;
  /** Hint shown below the form */
  hint?: string;
  /** Optional source tag — sent to the API so you can segment lists */
  source?: string;
  /** Compact = no surrounding card (use inline within sidebars) */
  compact?: boolean;
}

export default function EmailCapture({
  title = 'Weekly UK Finance Brief',
  subtitle = 'Get tax changes, personal finance tips and tool updates in your inbox — every Tuesday.',
  cta = 'Subscribe',
  hint = 'Free · No spam · Unsubscribe in one click.',
  source = 'inline',
  compact = false,
}: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('err'); setErrorMsg('Please enter a valid email address.'); return;
    }
    setState('loading');
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (!r.ok) throw new Error('Subscribe failed');
      setState('ok');
    } catch {
      setState('err');
      setErrorMsg('Something went wrong. Try again in a moment.');
    }
  };

  if (state === 'ok') {
    return (
      <div className={compact ? '' : 'my-10 rounded-3xl bg-gradient-to-br from-success-soft to-surface border border-outline-variant p-6 md:p-7 shadow-soft'}>
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-xl bg-success text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" strokeWidth={3} />
          </span>
          <div>
            <div className="font-display font-bold text-[16px] text-on-surface leading-tight">
              You&apos;re in 🎉
            </div>
            <p className="mt-1 text-[13px] text-on-surface-variant leading-snug">
              Check your inbox for a confirmation. The first brief lands next Tuesday.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={compact ? '' : 'my-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-ink via-[#00287e] to-primary/40 p-6 md:p-7 text-white border border-outline-variant shadow-soft'}>
      {!compact && (
        <>
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
        </>
      )}
      <div className={compact ? '' : 'relative z-10'}>
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: compact ? 'var(--color-primary)' : 'var(--color-primary-fixed)' }}>
          <Sparkles className="w-3 h-3" />
          Newsletter
        </div>
        <h3 className={`font-display font-bold text-[18px] md:text-[20px] leading-tight tracking-[-0.015em] ${compact ? 'text-on-surface' : 'text-white'}`}>
          {title}
        </h3>
        <p className={`mt-2 text-[13.5px] leading-relaxed ${compact ? 'text-on-surface-variant' : 'text-white/70'}`}>
          {subtitle}
        </p>

        <form onSubmit={submit} className="mt-4 flex flex-col sm:flex-row gap-2">
          <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
          <div className={`relative flex-1 ${compact ? '' : ''}`}>
            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${compact ? 'text-on-surface-variant/70' : 'text-white/40'}`} />
            <input
              id={`email-${source}`}
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === 'err') setState('idle'); }}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-[14px] font-medium outline-none transition-colors duration-100 ${
                compact
                  ? 'bg-surface-container border border-outline-variant focus:bg-surface-container-lowest focus:border-primary text-on-surface placeholder:text-on-surface-variant/70'
                  : 'bg-white/[0.08] border border-white/[0.14] focus:bg-white/[0.13] focus:border-white/30 text-white placeholder:text-white/40'
              }`}
              disabled={state === 'loading'}
              aria-invalid={state === 'err'}
            />
          </div>
          <button
            type="submit"
            disabled={state === 'loading'}
            className="bg-primary text-white font-bold px-5 py-3 rounded-xl text-[13.5px] hover:bg-primary-strong active:scale-[0.98] transition-all duration-100 disabled:opacity-50 shadow-soft"
          >
            {state === 'loading' ? 'Subscribing…' : cta}
          </button>
        </form>

        {state === 'err' && errorMsg && (
          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#ffdad6]">
            <AlertCircle className="w-3 h-3" /> {errorMsg}
          </p>
        )}

        <p className={`mt-3 text-[11px] ${compact ? 'text-on-surface-variant/80' : 'text-white/50'}`}>
          {hint}
        </p>
      </div>
    </div>
  );
}
