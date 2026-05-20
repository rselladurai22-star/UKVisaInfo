/**
 * UK number-plate validation + age inference.
 *
 * Modern UK plates (post-2001) follow a strict format:
 *   AB12 CDE
 *   ^^   ^^^
 *   memory tag + age identifier + random letters
 *
 * Age identifier:
 *   – First half (Mar–Aug) of year YY:  identifier = YY        (e.g. 24 = Mar 2024)
 *   – Second half (Sep–Feb) of year YY: identifier = YY + 50   (e.g. 74 = Sep 2024)
 *
 * Pre-2001 (prefix or suffix style) we don't parse — just label "pre-2001".
 *
 * Source: DVLA – "Vehicle registration numbers and number plates".
 */

const MODERN_PLATE = /^[A-Z]{2}\d{2}\s?[A-Z]{3}$/i;
const PREFIX_PLATE = /^[A-Z]\d{1,3}\s?[A-Z]{3}$/i;
const SUFFIX_PLATE = /^[A-Z]{3}\s?\d{1,3}\s?[A-Z]$/i;

export interface RegInfo {
  valid: boolean;
  normalised: string;
  era: 'modern' | 'prefix' | 'suffix' | 'unknown';
  ageHint?: string;       // human-readable e.g. "March 2024 onwards"
  approxYear?: number;
}

export function inspectReg(input: string): RegInfo {
  const raw = (input || '').toUpperCase().replace(/\s+/g, '');
  if (!raw) return { valid: false, normalised: '', era: 'unknown' };

  // Modern current-style
  if (MODERN_PLATE.test(input.toUpperCase()) || MODERN_PLATE.test(raw.replace(/^([A-Z]{2}\d{2})/, '$1 '))) {
    const id = parseInt(raw.substring(2, 4), 10);
    let approxYear: number;
    let ageHint: string;
    if (id <= 50) {
      approxYear = 2000 + id;
      ageHint = `March ${approxYear} – August ${approxYear}`;
    } else {
      approxYear = 2000 + (id - 50);
      ageHint = `September ${approxYear} – February ${approxYear + 1}`;
    }
    return {
      valid: true,
      normalised: raw.slice(0, 4) + ' ' + raw.slice(4),
      era: 'modern',
      approxYear,
      ageHint,
    };
  }

  if (PREFIX_PLATE.test(input.toUpperCase())) {
    return { valid: true, normalised: raw, era: 'prefix', ageHint: '1983 – 2001 (prefix style)' };
  }
  if (SUFFIX_PLATE.test(input.toUpperCase())) {
    return { valid: true, normalised: raw, era: 'suffix', ageHint: '1963 – 1983 (suffix style)' };
  }

  return { valid: false, normalised: raw, era: 'unknown' };
}
