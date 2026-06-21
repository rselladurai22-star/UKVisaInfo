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
 *   > [!STAT] £41,700 | Minimum salary 2026
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
 *   > A: £41,700 from April 2026.
 *
 *   > [!QUOTE]
 *   > The hardest part is finding a sponsor licence holder.
 *   > — Sarah, immigration solicitor
 *
 *   > [!BARS] Salary comparison      (horizontal bar chart)
 *   > Nurse :: 37000 :: £37,000
 *
 *   > [!LINE] Take-home by salary     (trend line chart)
 *   > £20k :: 17920 :: £17,920
 *
 *   > [!DONUT] Where your £1 goes     (donut / composition chart)
 *   > Take-home :: 68 :: 68%
 *
 *   > [!FLOW] Application stages      (vertical process / flow diagram)
 *   > Find a sponsor :: Employer holds a licence :: required
 *   > Get a CoS :: Certificate issued :: 3 months
 *
 *   > [!IMAGE] /blog/chart.png | Caption text | 1200x800   (optimized picture)
 *
 * Blocks can appear in ANY order and ANY quantity per post — structure and
 * data vary blog-to-blog; the design of each block stays identical everywhere.
 */

export type Segment =
  | { type: 'markdown'; content: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'tip' | 'note'; content: string }
  | { type: 'stat'; value: string; label: string }
  | { type: 'steps'; items: StepItem[] }
  | { type: 'checklist'; name: string; items: string[] }
  | { type: 'faq'; items: FaqItem[] }
  | { type: 'quote'; content: string; attribution?: string }
  | { type: 'key'; title: string; items: string[] }
  | { type: 'bars'; title: string; items: BarItem[] }
  | { type: 'line'; title: string; items: BarItem[] }
  | { type: 'donut'; title: string; items: BarItem[] }
  | { type: 'flow'; title: string; items: FlowItem[] }
  | { type: 'image'; src: string; alt: string; caption?: string; width: number; height: number };

export interface StepItem { title: string; body: string }
export interface FaqItem  { q: string; a: string }
export interface BarItem  { label: string; value: number; display: string }
export interface FlowItem { label: string; detail: string; tag?: string }

const DIRECTIVE = /^>\s*\[!(INFO|WARNING|TIP|NOTE|STAT|STEPS|CHECKLIST|FAQ|QUOTE|KEY|BARS|LINE|DONUT|FLOW|IMAGE)\](?:\s+(.*))?$/i;

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
    const TITLE_ARG = new Set(['STAT', 'CHECKLIST', 'KEY', 'BARS', 'LINE', 'DONUT', 'FLOW', 'IMAGE']);
    if (!TITLE_ARG.has(type) && inlineArg) {
      // For callouts/quotes, the inline content is the first body line.
      // The TITLE_ARG types treat the inline arg as a value/title/source instead.
      blockLines.push(inlineArg);
    }
    i++;
    while (i < lines.length) {
      const next = lines[i];
      if (next.startsWith('>')) {
        // A new directive line ends this block (adjacent blocks don't merge).
        if (DIRECTIVE.test(next)) break;
        blockLines.push(next.replace(/^>\s?/, ''));
        i++;
      } else if (
        next.trim() === '' &&
        i + 1 < lines.length &&
        lines[i + 1].startsWith('>') &&
        !DIRECTIVE.test(lines[i + 1])
      ) {
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

      case 'KEY': {
        const items = blockText
          .split('\n')
          .map((l) => l.replace(/^[-*]\s+/, '').trim())
          .filter(Boolean);
        segments.push({ type: 'key', title: inlineArg, items });
        break;
      }

      case 'BARS': {
        // Each line: "Label :: 49400 :: £49,400"  (display optional)
        segments.push({ type: 'bars', title: inlineArg, items: parseBars(blockText) });
        break;
      }

      case 'LINE': {
        // Same row syntax as BARS, rendered as a trend line.
        segments.push({ type: 'line', title: inlineArg, items: parseBars(blockText) });
        break;
      }

      case 'DONUT': {
        // Same row syntax as BARS, rendered as a donut / composition chart.
        segments.push({ type: 'donut', title: inlineArg, items: parseBars(blockText) });
        break;
      }

      case 'FLOW': {
        // Each line: "Label :: detail :: tag"  (detail/tag optional)
        const items: FlowItem[] = blockText
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const parts = l.split('::').map((p) => p.trim());
            return { label: parts[0] ?? '', detail: parts[1] ?? '', tag: parts[2] || undefined };
          });
        segments.push({ type: 'flow', title: inlineArg, items });
        break;
      }

      case 'IMAGE': {
        // "src | caption | 1200x800"  (caption + dimensions optional)
        const parts = inlineArg.split('|').map((p) => p.trim());
        const src = parts[0] ?? '';
        const caption = parts[1] || undefined;
        const dim = (parts[2] || '').match(/(\d+)\s*[x×]\s*(\d+)/);
        segments.push({
          type: 'image',
          src,
          alt: caption ?? '',
          caption,
          width: dim ? parseInt(dim[1], 10) : 1600,
          height: dim ? parseInt(dim[2], 10) : 900,
        });
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

/** Rows of "Label :: 49400 :: £49,400" (display optional). Shared by BARS/LINE/DONUT. */
function parseBars(text: string): BarItem[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const parts = l.split('::').map((p) => p.trim());
      const label = parts[0] ?? '';
      const value = parseFloat((parts[1] ?? '').replace(/[^0-9.]/g, '')) || 0;
      const display = parts[2] || parts[1] || '';
      return { label, value, display };
    });
}

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
