import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter subscription endpoint.
 *
 * Activates automatically when these env vars are set:
 *   - RESEND_API_KEY        (https://resend.com/api-keys)
 *   - RESEND_AUDIENCE_ID    (https://resend.com/audiences)
 *
 * Add them to .env.local locally and to your Vercel project settings
 * for production. No code changes required — this route detects them
 * at runtime and forwards subscriptions to Resend.
 *
 * For other providers (ConvertKit / Beehiiv / MailerLite), follow the
 * same pattern: check for the relevant env var(s) and fetch their API.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Body { email?: string; source?: string }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, source = 'unknown' } = (await req.json()) as Body;
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audId  = process.env.RESEND_AUDIENCE_ID;

    if (apiKey && audId) {
      // Resend audience integration
      const r = await fetch(`https://api.resend.com/audiences/${audId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          // Resend doesn't have native tags yet; encode source in first_name
          // so it shows up in the dashboard. Replace with proper tagging
          // when Resend adds it.
          first_name: `[${source}]`,
        }),
      });

      // 409 = already exists → still a success from the user's POV
      if (!r.ok && r.status !== 409) {
        const txt = await r.text().catch(() => '');
        console.error('[subscribe] Resend error', r.status, txt);
        return NextResponse.json({ error: 'Provider error' }, { status: 502 });
      }
    } else {
      // No provider configured — log so the operator knows signups are
      // arriving but nothing is being persisted yet.
      console.log(`[subscribe] (NO PROVIDER) ${email} source=${source}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscribe] failed', err);
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
