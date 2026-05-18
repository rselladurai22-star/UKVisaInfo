import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

interface RawSponsor {
  n: string;
  c: string;
  o?: string;
  t: 'AP' | 'A' | 'B' | 'PR';
  r: string[];
  g?: string;
}

// Module-level cache — parsed once per server process, never re-read
let cachedData: RawSponsor[] | null = null;

function getSponsors(): RawSponsor[] {
  if (cachedData) return cachedData;
  const filePath = path.join(process.cwd(), 'public', 'sponsors-data.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  cachedData = JSON.parse(raw) as RawSponsor[];
  return cachedData;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q      = (searchParams.get('q') ?? '').trim().toLowerCase();
  const region = searchParams.get('region') ?? '';
  const rating = searchParams.get('rating') ?? '';
  const route  = searchParams.get('route') ?? '';
  const page   = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10));
  const size   = Math.min(60, Math.max(10, parseInt(searchParams.get('size') ?? '60', 10)));

  try {
    const all = getSponsors();

    const filtered = all.filter((s) => {
      if (q && !s.n.toLowerCase().includes(q) && !s.c.toLowerCase().includes(q)) return false;
      if (region && s.g !== region) return false;
      if (rating && s.t !== rating) return false;
      if (route  && !s.r.includes(route)) return false;
      return true;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / size);
    const items = filtered.slice(page * size, (page + 1) * size);

    return NextResponse.json(
      { items, total, page, totalPages },
      {
        headers: {
          // Cache at CDN edge for 1 hour; revalidate in background
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    console.error('Sponsor API error:', err);
    return NextResponse.json({ error: 'Failed to load sponsor data' }, { status: 500 });
  }
}

// Return unique region values for the filter dropdown
export async function HEAD(req: NextRequest) {
  void req;
  return new NextResponse(null, { status: 200 });
}
