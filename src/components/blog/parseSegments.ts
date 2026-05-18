/**
 * Markdown shorthand parser for custom blog content blocks.
 *
 * Recognised syntax (each is a blockquote starting with [!TYPE]):
 *
 *   > [!INFO] One-line callout body
 *   > Continued body on second line.
 *
 *   > [!WARNING] ...
 *   > [!TIP] ...
 *   > [!NOTE] ...
 *
 *   > [!STAT] £38,700 | Minimum salary 2026
 *
 *   > [!STEPS]
 *   > 1. **Title** — Description text.
 *   > 2. **Next title** — More description.
 *
 *   > [!CHECKLIST] documents
 *   > - Passport valid 6 months
 *   > - Certificate of Sponsorship
 *
 *   > [!FAQ]
 *   > Q: Can I switch from Student visa?
 *   > A: Yes, switching is allowed in-country.
 *   >
 *   > Q: What is the minimum salary?
 *   > A: £38,700 from April 2026.
 *
 *   > [!QUOTE]
 *   > The hardest part is finding a sponsor licence holder.
 *   > — Sarah, immigration solicitor
 */

export type Segment =
  | { type: 'markdown'; content: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'tip' | 'note'; content: string }
  | { type: 'stat'; value: string; label: string }
  | { type: 'steps'; items: StepItem[] }
  | { type: 'checklist'; name: string; items: string[] }
  | { type: 'faq'; items: FaqItem[] }
  | { type: 'quote'; content: string; attribution?: string };

export interface StepItem { title: string; body: string }
export interface FaqItem  { q: string; a: string }

const DIRECTIVE = /^>\s*\[!(INFO|WARNING|TIP|NOTE|STAT|STEPS|CHECKLIST|FAQ|QUOTE)\](?:\s+(.*))?$/i;

export function parseSegments(md: string): Segment[] {
  const lines = md.split('\n');
  const segments: Segment[] = [];
  let buffer: string[] = [];

  const flushMarkdown = () => {
    if (buffer.length) {
      const content = buffer.join('\n').trim();
      if (content) segments.push({ type: 'markdown', content });
      buffer = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(DIRECTIVE);

    if (!m) {
      buffer.push(line);
      i++;
      continue;
    }

    flushMarkdown();
    const type = m[1].toUpperCase();
    const inlineArg = (m[2] ?? '').trim();

    // Collect all subsequent blockquote lines (allows internal blank lines)
    const blockLines: string[] = [];
    if (type !== 'STAT' && type !== 'CHECKLIST' && inlineArg) {
      // For callouts/quotes, the inline content is the first body line.
      blockLines.push(inlineArg);
    }
    i++;
    while (i < lines.length) {
      const next = lines[i];
      if (next.startsWith('>')) {
        blockLines.push(next.replace(/^>\s?/, ''));
        i++;
      } else if (next.trim() === '' && i + 1 < lines.length && lines[i + 1].startsWith('>')) {
        // Blank line *inside* the block — keep as paragraph break
        blockLines.push('');
        i++;
      } else {
        break;
      }
    }

    const blockText = blockLines.join('\n').trim();

    switch (type) {
      case 'INFO':
      case 'WARNING':
      case 'TIP':
      case 'NOTE':
        segments.push({
          type: 'callout',
          variant: type.toLowerCase() as 'info' | 'warning' | 'tip' | 'note',
          content: blockText,
        });
        break;

      case 'STAT': {
        const parts = inlineArg.split('|').map((p) => p.trim());
        segments.push({
          type: 'stat',
          value: parts[0] ?? blockText.split('|')[0]?.trim() ?? '',
          label: parts[1] ?? blockText.split('|')[1]?.trim() ?? '',
        });
        break;
      }

      case 'STEPS': {
        const items = parseSteps(blockText);
        segments.push({ type: 'steps', items });
        break;
      }

      case 'CHECKLIST': {
        const items = blockText
          .split('\n')
          .map((l) => l.replace(/^[-*]\s+/, '').trim())
          .filter(Boolean);
        segments.push({
          type: 'checklist',
          name: inlineArg || 'default',
          items,
        });
        break;
      }

      case 'FAQ': {
        const items = parseFaq(blockText);
        segments.push({ type: 'faq', items });
        break;
      }

      case 'QUOTE': {
        const lns = blockText.split('\n').map((l) => l.trim()).filter(Boolean);
        let attribution: string | undefined;
        const last = lns[lns.length - 1];
        if (last && /^[—–-]{1,2}\s+/.test(last)) {
          attribution = last.replace(/^[—–-]{1,2}\s*/, '').trim();
          lns.pop();
        }
        segments.push({ type: 'quote', content: lns.join(' ').trim(), attribution });
        break;
      }
    }
  }

  flushMarkdown();
  return segments;
}

/* ── Helpers ───────────────────────────────────────── */

function parseSteps(text: string): StepItem[] {
  // Match lines like "1. **Title** — body" or "1. Title — body" (em dash, en dash, or hyphen)
  const items: StepItem[] = [];
  const re = /^\s*\d+\.\s+(.+?)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const line = m[1].trim();
    // Split title vs body on first em/en dash with spaces
    const sep = line.match(/^(.+?)\s+[—–-]\s+(.+)$/);
    if (sep) {
      items.push({
        title: sep[1].replace(/\*\*/g, '').trim(),
        body: sep[2].trim(),
      });
    } else {
      items.push({ title: line.replace(/\*\*/g, '').trim(), body: '' });
    }
  }
  return items;
}

function parseFaq(text: string): FaqItem[] {
  const items: FaqItem[] = [];
  const blocks = text.split(/\n\s*\n/); // split on blank lines
  for (const block of blocks) {
    const lines = block.split('\n');
    let q = ''; let a = '';
    let mode: 'q' | 'a' | null = null;
    for (const ln of lines) {
      const qm = ln.match(/^Q[:.)]\s*(.+)$/i);
      const am = ln.match(/^A[:.)]\s*(.+)$/i);
      if (qm) { q = qm[1].trim(); mode = 'q'; }
      else if (am) { a = am[1].trim(); mode = 'a'; }
      else if (mode === 'a') { a += ' ' + ln.trim(); }
      else if (mode === 'q') { q += ' ' + ln.trim(); }
    }
    if (q && a) items.push({ q: q.trim(), a: a.trim() });
  }
  return items;
}
