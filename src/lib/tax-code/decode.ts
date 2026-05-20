/**
 * UK tax-code decoder (HMRC PAYE codes for 2026/27).
 *
 * A tax code tells your employer how much Personal Allowance you have for
 * the year. Examples: 1257L · 1257L W1 · K475 · BR · D0 · D1 · NT · S1257L · C1257L
 *
 * Source: HMRC – "Tax codes" (https://www.gov.uk/tax-codes), HMRC PAYE manual.
 */

export interface TaxCodeMeaning {
  ok: boolean;
  raw: string;
  region: 'England & NI' | 'Scotland' | 'Wales' | 'Unknown';
  emergency: boolean;          // W1 / M1 / X (non-cumulative)
  scheme:
    | 'standard'               // numeric+L family — normal allowance
    | 'married-received'       // M — received marriage allowance
    | 'married-transferred'    // N — transferred marriage allowance
    | 'review'                 // T — under HMRC review
    | 'no-allowance'           // 0T — no PA
    | 'k-code'                 // K — negative allowance (untaxed income added)
    | 'all-basic'              // BR — all at 20%
    | 'all-higher'             // D0 — all at 40%
    | 'all-additional'         // D1 — all at 45%
    | 'all-top'                // D2 / D3 — Scottish advanced/top rates
    | 'no-tax'                 // NT — no tax deducted
    | 'unknown';
  personalAllowance: number;   // for the year, in £ (can be negative for K)
  explainer: string;           // plain-English meaning
  warning?: string;            // if something looks off
}

export function decodeTaxCode(input: string): TaxCodeMeaning {
  const raw = (input || '').trim().toUpperCase().replace(/\s+/g, ' ');
  if (!raw) {
    return base(raw, { ok: false, scheme: 'unknown', explainer: 'Type a tax code to decode it.' });
  }

  // Strip emergency suffix
  const emergency = /\b(W1|M1|X)\b/.test(raw);
  const stripped = raw.replace(/\s*(W1|M1|X)\s*/g, '').trim();

  // Region prefix
  let region: TaxCodeMeaning['region'] = 'England & NI';
  let core = stripped;
  if (core.startsWith('S')) { region = 'Scotland';     core = core.slice(1); }
  else if (core.startsWith('C')) { region = 'Wales';   core = core.slice(1); }

  // Flat schemes
  if (core === 'BR')  return base(raw, { ok: true, region, emergency, scheme: 'all-basic',      personalAllowance: 0,
    explainer: 'All this income is taxed at the basic rate (20%). Common for a second job or pension. You get no Personal Allowance on this source.' });
  if (core === 'D0')  return base(raw, { ok: true, region, emergency, scheme: 'all-higher',     personalAllowance: 0,
    explainer: 'All this income is taxed at the higher rate (40%). Used when your main employment already uses your full PA and basic-rate band.' });
  if (core === 'D1')  return base(raw, { ok: true, region, emergency, scheme: 'all-additional', personalAllowance: 0,
    explainer: 'All this income is taxed at the additional rate (45%). Used when other income already fills the higher-rate band.' });
  if (core === 'D2')  return base(raw, { ok: true, region, emergency, scheme: 'all-top',        personalAllowance: 0,
    explainer: 'All this income is taxed at the Scottish Advanced rate (45%). Scotland-only.' });
  if (core === 'D3')  return base(raw, { ok: true, region, emergency, scheme: 'all-top',        personalAllowance: 0,
    explainer: 'All this income is taxed at the Scottish Top rate (48%). Scotland-only.' });
  if (core === 'NT')  return base(raw, { ok: true, region, emergency, scheme: 'no-tax',         personalAllowance: 0,
    explainer: 'No tax is deducted from this income (rare — e.g. specific double-taxation agreements or bankruptcy cases).' });
  if (core === '0T')  return base(raw, { ok: true, region, emergency, scheme: 'no-allowance',   personalAllowance: 0,
    explainer: 'No Personal Allowance — all income taxed at the prevailing rate bands. Common for new joiners awaiting a P45, or where PA is used up elsewhere.' });

  // K-code (negative allowance — for untaxed company benefits, state pension, owed tax)
  const k = core.match(/^K(\d+)$/);
  if (k) {
    const negNumber = parseInt(k[1], 10);
    const pa = -(negNumber * 10 + 9); // K475 → -£4,759
    return base(raw, {
      ok: true, region, emergency, scheme: 'k-code', personalAllowance: pa,
      explainer: `K-code: instead of getting Personal Allowance, an extra £${(-pa).toLocaleString()} is added to your taxable pay this year (usually because of taxable benefits, state pension, or tax owed from a previous year).`,
      warning: 'K codes mean PAYE can take up to 50% of your pay in any single period. Check the underlying adjustments are right with HMRC if you weren\'t expecting one.',
    });
  }

  // Numeric + suffix codes
  const m = core.match(/^(\d{1,4})([LMNT])$/);
  if (m) {
    const numeric = parseInt(m[1], 10);
    const suffix = m[2] as 'L' | 'M' | 'N' | 'T';
    const pa = numeric * 10 + 9; // 1257L → £12,579 (HMRC rounds, so 1257 ≡ £12,570–£12,579)

    const standardPA = 12570; // 2026/27
    const expectedNumeric = 1257;

    const schemeMap: Record<'L' | 'M' | 'N' | 'T', TaxCodeMeaning['scheme']> = {
      L: 'standard',
      M: 'married-received',
      N: 'married-transferred',
      T: 'review',
    };

    const explainMap: Record<'L' | 'M' | 'N' | 'T', string> = {
      L: `Standard tax-free Personal Allowance of around £${(numeric * 10).toLocaleString()}. The "L" means you get the basic PA.`,
      M: `You've received 10% of your spouse/civil partner's Personal Allowance via the Marriage Allowance — increases your PA to about £${(numeric * 10).toLocaleString()}.`,
      N: `You've transferred 10% of your Personal Allowance to your spouse/civil partner — your PA is reduced to about £${(numeric * 10).toLocaleString()}.`,
      T: `"T" means your code is being reviewed by HMRC (often due to estimated income or complex deductions). Your effective PA is about £${(numeric * 10).toLocaleString()}.`,
    };

    let warning: string | undefined;
    if (suffix === 'L' && numeric !== expectedNumeric) {
      if (numeric < expectedNumeric) {
        warning = `Your allowance is below the standard £${standardPA.toLocaleString()}. Common reasons: untaxed income, benefits-in-kind (company car, medical insurance), or HMRC reclaiming under-paid tax. Check your coding notice (form P2) to see why.`;
      } else if (numeric > expectedNumeric) {
        warning = `Your allowance is above the standard £${standardPA.toLocaleString()}. Usually means you're claiming job expenses, professional subscriptions, or the marriage allowance — verify on your coding notice.`;
      }
    }

    return base(raw, {
      ok: true,
      region,
      emergency,
      scheme: schemeMap[suffix],
      personalAllowance: pa,
      explainer: explainMap[suffix],
      warning,
    });
  }

  return base(raw, {
    ok: false, scheme: 'unknown',
    explainer: 'Code not recognised. UK tax codes follow patterns like 1257L, K475, BR, D0, D1, NT, 0T — optionally prefixed with S (Scotland) or C (Wales), and optionally suffixed with W1, M1 or X for emergency (non-cumulative) treatment.',
  });
}

function base(raw: string, override: Partial<TaxCodeMeaning>): TaxCodeMeaning {
  return {
    ok: false,
    raw,
    region: 'Unknown',
    emergency: false,
    scheme: 'unknown',
    personalAllowance: 0,
    explainer: '',
    ...override,
  };
}
