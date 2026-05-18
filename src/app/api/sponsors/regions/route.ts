import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

interface RawSponsor { g?: string; }

let cachedRegions: string[] | null = null;

function getRegions(): string[] {
  if (cachedRegions) return cachedRegions;
  const filePath = path.join(process.cwd(), 'public', 'sponsors-data.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw) as RawSponsor[];
  const set = new Set<string>();
  for (const s of data) { if (s.g) set.add(s.g); }
  cachedRegions = Array.from(set).sort();
  return cachedRegions;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const regions = getRegions();
    return NextResponse.json(regions, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
