'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, X, Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  icon?: ReactNode;
  label?: string;
  maxResults?: number;
  inputClassName?: string;
  id?: string;
}

// Highlight matched substring in suggestion
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-secondary/15 text-secondary font-bold rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function CountryAutocomplete({
  value,
  onChange,
  options,
  placeholder = 'Search for a country…',
  icon,
  label,
  maxResults = 8,
  inputClassName,
  id,
}: Props) {
  const autoId = useId();
  const listId = id ? `${id}-list` : `cac-${autoId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options.slice(0, maxResults);
    // Prefer prefix matches, then substring
    const prefix: string[] = [];
    const contains: string[] = [];
    for (const o of options) {
      const lo = o.toLowerCase();
      if (lo.startsWith(q)) prefix.push(o);
      else if (lo.includes(q)) contains.push(o);
    }
    return [...prefix, ...contains].slice(0, maxResults);
  }, [options, value, maxResults]);

  // Reset active index when the filtered list changes
  useEffect(() => {
    setActive(0);
  }, [value]);

  // Click outside closes — use mousedown so focus isn't stolen mid-type
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Keep highlighted item in view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLLIElement>(
      `[data-idx="${active}"]`
    );
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const commit = (v: string) => {
    onChange(v);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && filtered[active]) {
        e.preventDefault();
        commit(filtered[active]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Tab') {
      if (open && filtered[active] && value) {
        // Commit current highlight but allow tab to move focus
        onChange(filtered[active]);
        setOpen(false);
      }
    }
  };

  const activeId = filtered[active] ? `${listId}-opt-${active}` : undefined;

  return (
    <div ref={wrapRef} className="relative group">
      {icon && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-outline-variant group-focus-within:text-primary transition-colors pointer-events-none">
          {icon}
        </span>
      )}
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={
          inputClassName ??
          'w-full pl-10 pr-16 py-4 bg-transparent border-b-2 border-outline-variant/40 focus:border-primary focus:ring-0 outline-none transition-all text-lg font-medium placeholder:text-outline-variant/60'
        }
        autoComplete="off"
        spellCheck={false}
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value && (
          <button
            type="button"
            aria-label="Clear"
            onMouseDown={(e) => {
              // Prevent input blur so focus stays
              e.preventDefault();
              onChange('');
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="p-1 rounded-full text-outline-variant hover:text-secondary hover:bg-surface-container-high transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          aria-label={open ? 'Close options' : 'Open options'}
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="p-1 text-outline-variant hover:text-primary transition-colors"
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full bg-surface-container-lowest mt-2 border border-outline-variant/30 rounded-xl shadow-2xl overflow-hidden"
          >
            {filtered.length > 0 ? (
              <ul
                ref={listRef}
                role="listbox"
                id={listId}
                className="max-h-72 overflow-y-auto py-1"
              >
                {filtered.map((c, i) => (
                  <li
                    key={c}
                    id={`${listId}-opt-${i}`}
                    role="option"
                    aria-selected={i === active}
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    // mousedown so we fire before the input loses focus
                    onMouseDown={(e) => {
                      e.preventDefault();
                      commit(c);
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors ${
                      i === active
                        ? 'bg-secondary/8 text-primary'
                        : 'text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    <Search
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        i === active ? 'text-secondary' : 'text-outline-variant'
                      }`}
                    />
                    <span className="truncate">
                      <Highlighted text={c} query={value} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-xs text-on-surface-variant italic">
                No matches for "{value}"
              </div>
            )}
            <div className="border-t border-outline-variant/20 px-4 py-2 bg-surface-container-low/50 flex items-center justify-between text-[10px] text-on-surface-variant/70 tracking-wider uppercase">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
