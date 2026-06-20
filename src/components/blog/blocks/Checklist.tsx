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
    <div className="my-10 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 md:p-7 shadow-cs">
      {/* header */}
      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex w-9 h-9 rounded-xl bg-blue-50 items-center justify-center text-blue-600">
            <ListChecks className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[14px] font-bold text-slate-900 leading-tight">Your checklist</div>
            <div className="text-[11.5px] text-slate-500 mt-0.5">
              {done.size}/{items.length} complete · progress saved locally
            </div>
          </div>
        </div>
        {done.size > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500 hover:text-blue-700 transition-colors duration-100 px-2.5 py-1.5 rounded-lg hover:bg-blue-50"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-[width] duration-300 ease-out"
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
                className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-100 group"
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center border-2 transition-[background,border-color,transform] duration-150 ${
                    checked
                      ? 'bg-blue-600 border-blue-600 scale-100'
                      : 'border-slate-300 group-hover:border-blue-500 bg-white'
                  }`}
                >
                  <Check
                    className={`w-3.5 h-3.5 text-white transition-opacity duration-100 ${checked ? 'opacity-100' : 'opacity-0'}`}
                    strokeWidth={3}
                  />
                </span>
                <span
                  className={`flex-1 text-[15px] leading-snug transition-all duration-150 ${
                    checked ? 'text-slate-400 line-through' : 'text-slate-700'
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
        <div className="mt-4 text-center text-[13px] font-semibold text-emerald-600">
          🎉 All set — ready to apply.
        </div>
      )}
    </div>
  );
}
