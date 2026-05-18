import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter subscription endpoint.
 *
 * Currently logs the email to the server console. To start collecting
 * for real, wire one of the following:
 *
 *   1. Resend audiences — set RESEND_API_KEY + RESEND_AUDIENCE_ID,
 *      then POST to https://api.resend.com/audiences/{id}/contacts.
 *
 *   2. ConvertKit — set CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID, POST
 *      to https://api.convertkit.com/v3/forms/{id}/subscribe.
 *
 *   3. Beehiiv / MailerLite / Buttondown — similar pattern.
 *
 * The {source} field lets you segment subscribers by where they signed
 * up (article inline, footer, sidebar etc.).
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

    // TODO — replace this console log with a real provider call.
    console.log(`[subscribe] ${email} (source: ${source})`);

    /* Example Resend integration (uncomment + set env vars):
    const apiKey  = process.env.RESEND_API_KEY;
    const audId   = process.env.RESEND_AUDIENCE_ID;
    if (apiKey && audId) {
      const r = await fetch(`https://api.resend.com/audiences/${audId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
      if (!r.ok && r.status !== 409) {
        const t = await r.text();
        console.error('Resend error', r.status, t);
        return NextResponse.json({ error: 'Provider error' }, { status: 502 });
      }
    }
    */

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
