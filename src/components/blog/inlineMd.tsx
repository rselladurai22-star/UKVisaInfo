import React from 'react';

// Lightweight inline-markdown renderer for block components whose content
// arrives as a raw string (callouts, key takeaways, steps). Handles **bold**
// and [label](url), the only inline syntax we use inside directive blocks.
// Without this, authored `**bold**` and links render as literal characters.
export function inlineMd(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <strong key={k++} className="font-semibold text-on-surface">
          {m[1]}
        </strong>
      );
    } else {
      nodes.push(
        <a
          key={k++}
          href={m[3]}
          className="text-primary font-semibold underline decoration-primary/40 decoration-[1.5px] underline-offset-[3px] hover:text-primary-strong transition-colors"
        >
          {m[2]}
        </a>
      );
    }
    last = regex.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
