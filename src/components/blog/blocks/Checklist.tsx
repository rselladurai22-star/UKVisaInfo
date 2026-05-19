'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, RotateCcw, ListChecks } from 'lucide-react';

interface Props { name: string; items: string[]; slug: string }

export default function Checklist({ name, items, slug }: Props) {
  const storageKey = useMemo(() => `checklist:${slug}:${name}`, [slug, name]);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw) as number[];
        setDone(new Set(arr.filter((n) => Number.isInteger(n) && n < items.length)));
      }
    } catch { /* ignore */ }
    setReady(true);
  }, [storageKey, items.length]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify([...done])); } catch { /* ignore */ }
  }, [done, storageKey, ready]);

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  const reset = () => setDone(new Set());

  const completedPct = items.length ? Math.round((done.size / items.length) * 100) : 0;

  return (
    <div className="my-10 rounded-3xl border border-[rgba(14,20,36,0.08)] bg-white p-6 md:p-7 shadow-[0_2px_12px_rgba(10, 37, 64,0.05)]">
      {/* header */}
      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-[rgba(14,20,36,0.06)]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex w-9 h-9 rounded-xl bg-[rgba(0, 196, 180,0.08)] items-center justify-center text-[#00C4B4]">
            <ListChecks className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[14px] font-bold text-[#0A2540] leading-tight">Your checklist</div>
            <div className="text-[11.5px] text-[#7a8195] mt-0.5">
              {done.size}/{items.length} complete · progress saved locally
            </div>
          </div>
        </div>
        {done.size > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#7a8195] hover:text-[#00C4B4] transition-colors duration-100 px-2.5 py-1.5 rounded-lg hover:bg-[rgba(0, 196, 180,0.06)]"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* progress bar */}
      <div className="h-1.5 bg-[#f3f5fb] rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-[#00C4B4] via-[#00C4B4] to-[#C9A14A] rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${completedPct}%` }}
        />
      </div>

      {/* items */}
      <ul className="space-y-1.5">
        {items.map((item, i) => {
          const checked = done.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#f7f9fd] transition-colors duration-100 group"
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center border-2 transition-[background,border-color,transform] duration-150 ${
                    checked
                      ? 'bg-[#00C4B4] border-[#00C4B4] scale-100'
                      : 'border-[#cfd5e0] group-hover:border-[#00C4B4] bg-white'
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 text-white transition-opacity duration-100 ${checked ? 'opacity-100' : 'opacity-0'}`}
                    strokeWidth={3}
                  />
                </span>
                <span
                  className={`flex-1 text-[15px] leading-snug transition-all duration-150 ${
                    checked ? 'text-[#7a8195] line-through' : 'text-[#1a2240]'
                  }`}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {completedPct === 100 && (
        <div className="mt-4 text-center text-[13px] font-semibold text-[#10b981]">
          🎉 All set — ready to apply.
        </div>
      )}
    </div>
  );
}
