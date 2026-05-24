/**
 * DocumentsCard — grouped document checklist (Identity / Finance /
 * Sponsor / Health). Each row has a checkbox the user can self-tick
 * as they collect the document. No paragraphs.
 */

'use client';

import { useState } from 'react';
import { IdCard, Wallet, Building2, Stethoscope, Check } from 'lucide-react';

const INK     = '#0B0F19';
const PAPER   = '#FFFFFF';
const CREAM   = '#FAFAF7';
const EMERALD = '#047857';
const SLATE   = '#475569';
const MUTED   = '#94908A';
const HAIR    = 'rgba(11,15,25,0.08)';

interface DocGroup {
  id: string;
  label: string;
  icon: typeof IdCard;
  items: string[];
}

function categorise(docs: string[]): DocGroup[] {
  const groups: DocGroup[] = [
    { id: 'identity', label: 'Identity',    icon: IdCard,      items: [] },
    { id: 'finance',  label: 'Finance',     icon: Wallet,      items: [] },
    { id: 'sponsor',  label: 'Sponsor',     icon: Building2,   items: [] },
    { id: 'health',   label: 'Health & Quals', icon: Stethoscope, items: [] },
  ];
  for (const d of docs) {
    const low = d.toLowerCase();
    if (/passport|biometric|brp|evisa|share code|nationality|certificate of birth|birth certificate|adoption|marriage|civil partnership|grandparent/i.test(low))
      groups[0].items.push(d);
    else if (/bank|payslip|p60|tax|hmrc|salary|maintenance|funds|savings|sa302|finance/i.test(low))
      groups[1].items.push(d);
    else if (/cas|cos|sponsor|certificate of sponsorship|certificate of acceptance|employer|letter|offer|course|institution|reference number|endorsement|business plan/i.test(low))
      groups[2].items.push(d);
    else if (/tb test|tuberculosis|english|ielts|selt|atas|life in the uk|qualification|degree|gmc|nmc|hcpc|criminal record|dbs|police|registration|cv/i.test(low))
      groups[3].items.push(d);
    else
      groups[2].items.push(d);
  }
  return groups.filter(g => g.items.length > 0);
}

interface Props { documents: string[]; }

export default function DocumentsCard({ documents }: Props) {
  const groups = categorise(documents);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const total = documents.length;
  const done  = checked.size;

  const toggle = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: HAIR }}>
          <div className="h-full transition-all duration-300"
               style={{ width: `${(done / total) * 100}%`, background: EMERALD }} />
        </div>
        <span className="text-[11.5px] tabular-nums font-semibold" style={{ color: SLATE }}>
          {done} / {total} ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.id} className="rounded-3xl overflow-hidden"
                 style={{ background: PAPER, border: `1px solid ${HAIR}`, boxShadow: '0 2px 14px -8px rgba(11,15,25,0.06)' }}>
              <div className="px-5 py-3.5 flex items-center gap-3"
                   style={{ background: CREAM, borderBottom: `1px solid ${HAIR}` }}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(4,120,87,0.10)', color: EMERALD }}>
                  <Icon className="w-4 h-4" strokeWidth={2} />
                </span>
                <h3 className="flex-1"
                    style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 15.5, letterSpacing: '-0.018em', color: INK, lineHeight: 1.1 }}>
                  {group.label}
                </h3>
                <span className="text-[11px] font-mono tabular-nums" style={{ color: MUTED }}>
                  {group.items.length}
                </span>
              </div>
              <ul className="px-2 py-2">
                {group.items.map((doc) => {
                  const key = `${group.id}:${doc}`;
                  const isOn = checked.has(key);
                  return (
                    <li key={key}>
                      <button type="button" onClick={() => toggle(key)}
                              className="w-full text-left px-3 py-2.5 rounded-xl flex items-start gap-3 transition-colors"
                              style={{ background: isOn ? 'rgba(4,120,87,0.06)' : 'transparent' }}>
                        <span className="mt-0.5 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-colors"
                              style={{
                                background: isOn ? EMERALD : 'transparent',
                                border: isOn ? `1.5px solid ${EMERALD}` : `1.5px solid ${HAIR}`,
                              }}>
                          {isOn && <Check className="w-3 h-3" style={{ color: '#fff' }} strokeWidth={3} />}
                        </span>
                        <span className="text-[13.5px] leading-[1.55] flex-1"
                              style={{ color: INK, textDecoration: isOn ? 'line-through' : 'none', opacity: isOn ? 0.55 : 1 }}>
                          {doc}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
