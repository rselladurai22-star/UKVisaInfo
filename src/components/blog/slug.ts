/**
 * Stable slug used for heading IDs across markdown rendering and the
 * client-side table-of-contents component. Keep both call sites in sync.
 */
export function headingSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // drop punctuation
    .trim()
    .replace(/\s+/g, '-');
}

export function extractH2Headings(markdown: string): { id: string; text: string }[] {
  const lines = markdown.split('\n');
  const out: { id: string; text: string }[] = [];
  let inCode = false;
  for (const raw of lines) {
    if (raw.startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = raw.match(/^##\s+(.+?)\s*$/);
    if (m) {
      const text = m[1].replace(/\*\*/g, '').trim();
      out.push({ id: headingSlug(text), text });
    }
  }
  return out;
}
