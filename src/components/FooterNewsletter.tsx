'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Send } from 'lucide-react';

export default function FooterNewsletter() {
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
        body: JSON.stringify({ email, source: 'footer' }),
      });
      if (!r.ok) throw new Error('fail');
      setState('ok');
    } catch {
      setState('err');
      setErrorMsg('Couldn\'t subscribe right now. Try again.');
    }
  };

  if (state === 'ok') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 text-[#34d399] text-[13px] font-semibold">
        <Check className="w-4 h-4" strokeWidth={3} />
        Subscribed — see you Tuesday.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="footer-email" className="sr-only">Email address</label>
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />
          <input
            id="footer-email"
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (state === 'err') setState('idle'); }}
            placeholder="you@example.com"
            disabled={state === 'loading'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[13.5px] font-medium bg-white/[0.06] border border-white/[0.12] focus:bg-white/[0.1] focus:border-white/30 text-white placeholder:text-white/35 outline-none transition-colors duration-100"
            aria-invalid={state === 'err'}
          />
        </div>
        <button
          type="submit"
          disabled={state === 'loading'}
          className="inline-flex items-center justify-center gap-1.5 bg-[#d9152b] text-white font-bold px-4 py-2.5 rounded-xl text-[13px] hover:bg-[#b8101f] active:scale-[0.98] transition-[background,transform] duration-100 disabled:opacity-50 shadow-[0_4px_14px_rgba(217,21,43,0.32)]"
        >
          <Send className="w-3.5 h-3.5" />
          {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {state === 'err' && errorMsg && (
        <p className="flex items-center gap-1.5 text-[11.5px] text-[#fca5a5]">
          <AlertCircle className="w-3 h-3" /> {errorMsg}
        </p>
      )}
    </form>
  );
}
