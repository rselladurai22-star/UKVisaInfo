'use client';

import { useState } from 'react';
import { MessageCircle, Send, ChevronDown, ChevronUp, ThumbsUp, Users, Bell, ExternalLink, Hash } from 'lucide-react';

/* ── Static Q&A data (replace with DB/CMS later) ── */
const QA_DATA = [
  {
    id: 1, tag: 'Skilled Worker',
    q: 'My CoS says £38,700 but I negotiated £40,000. Which salary does UKVI check?',
    a: 'UKVI checks the salary on your Certificate of Sponsorship (CoS), not your contract. Ask your employer to issue a corrected CoS before applying. The salary on CoS must meet or exceed the going rate for your SOC code.',
    votes: 47, answers: 3, date: '2026-05-10',
  },
  {
    id: 2, tag: 'Student',
    q: 'I have £14,000 in my account but it\'s been there only 20 days. Will I pass the financial requirement?',
    a: 'No — the funds must be held for 28 consecutive days ending no more than 31 days before your application date. You need to wait at least 8 more days before applying.',
    votes: 89, answers: 5, date: '2026-05-08',
  },
  {
    id: 3, tag: 'Visitor',
    q: 'My UK visitor visa was refused for "not satisfied you will leave". What can I do?',
    a: 'This is the most common refusal ground. Strengthen your next application with: bank statements showing strong financial ties to home country, proof of employment (letter from employer), property ownership, family ties (spouse/children), and return flight evidence. A well-written cover letter explaining your visit purpose also helps significantly.',
    votes: 134, answers: 8, date: '2026-05-06',
  },
  {
    id: 4, tag: 'Family',
    q: 'My sponsor earns £29,000. Do we meet the financial requirement for a Spouse visa?',
    a: 'The minimum income requirement for a UK Spouse/Partner visa is £29,000 gross per year (as of April 2024). So £29,000 exactly meets the threshold — but only if it\'s gross annual salary from employment. Check your payslips carefully. Savings can also be used to top up if you\'re slightly below.',
    votes: 62, answers: 4, date: '2026-05-04',
  },
  {
    id: 5, tag: 'ILR',
    q: 'I was outside the UK for 185 days in one year on my Skilled Worker visa. Does this affect my ILR?',
    a: 'Yes. For ILR (Indefinite Leave to Remain), you must not have spent more than 180 days outside the UK in any 12-month period during your qualifying period. Being absent for 185 days in one year means you will likely need to wait until that 12-month window passes before applying, or seek legal advice about discretionary considerations.',
    votes: 73, answers: 6, date: '2026-05-01',
  },
  {
    id: 6, tag: 'Health & Care',
    q: 'Can a care home sponsor me for a Health & Care Worker visa if they are not yet on the sponsor list?',
    a: 'No. The employer must hold a valid Skilled Worker sponsor licence before issuing a Certificate of Sponsorship. They can apply to become a sponsor on gov.uk (takes 8–12 weeks typically). You cannot apply for the visa until they are licensed and have issued your CoS.',
    votes: 55, answers: 3, date: '2026-04-28',
  },
];

const TAGS = ['All', 'Skilled Worker', 'Student', 'Visitor', 'Family', 'ILR', 'Health & Care', 'Switch Visa', 'Settlement'];

const CHANNELS = [
  {
    icon: '📱',
    name: 'WhatsApp Channel',
    desc: 'Instant alerts when UKVI changes fees, rules or processing times. 2,400+ followers.',
    color: '#25D366',
    bg: 'rgba(37,211,102,0.08)',
    border: 'rgba(37,211,102,0.25)',
    cta: 'Follow on WhatsApp',
    href: 'https://whatsapp.com/channel/0029VaFmqWH5Ej7nD3JBWB3V',
    stats: '2,400+ followers',
  },
  {
    icon: '✈️',
    name: 'Telegram Channel',
    desc: 'Daily visa news, fee changes, and immigration updates. Searchable archive.',
    color: '#229ED9',
    bg: 'rgba(34,158,217,0.08)',
    border: 'rgba(34,158,217,0.25)',
    cta: 'Join on Telegram',
    href: 'https://t.me/ukvisainfo',
    stats: '1,800+ subscribers',
  },
  {
    icon: '👥',
    name: 'Facebook Group',
    desc: 'Community of 8,000+ UK visa applicants sharing tips and experiences.',
    color: '#1877F2',
    bg: 'rgba(24,119,242,0.08)',
    border: 'rgba(24,119,242,0.25)',
    cta: 'Join Group',
    href: 'https://facebook.com/groups/ukvisainfo',
    stats: '8,000+ members',
  },
];

function QACard({ item }: { item: typeof QA_DATA[0] }) {
  const [open, setOpen] = useState(false);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(item.votes);

  return (
    <div className="bg-white dark:bg-[#0e1b2e] rounded-2xl border border-[#e8edf4] dark:border-white/8 overflow-hidden hover:border-[#00C4B4]/40 transition-colors duration-200">
      <button
        className="w-full text-left p-5 sm:p-6"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00C4B4]/10 text-[#007F76] dark:text-[#5EEAD9] border border-[#00C4B4]/20">
                <Hash className="w-3 h-3" />{item.tag}
              </span>
              <span className="text-xs text-[#5A6478] dark:text-white/40">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <p className="font-semibold text-[#0A2540] dark:text-white text-sm sm:text-base leading-snug pr-4">
              {item.q}
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1">
            {open
              ? <ChevronUp className="w-5 h-5 text-[#00C4B4]" />
              : <ChevronDown className="w-5 h-5 text-[#5A6478] dark:text-white/40" />}
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-[#f0f4f8] dark:border-white/6">
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00C4B4] to-[#007F76] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">UK</span>
              </div>
              <span className="text-xs font-semibold text-[#00C4B4]">UK Visa Info</span>
              <span className="text-xs text-[#5A6478] dark:text-white/40">· Verified Answer</span>
            </div>
            <p className="text-sm sm:text-base text-[#374151] dark:text-white/80 leading-relaxed">
              {item.a}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => { if (!voted) { setVotes(v => v + 1); setVoted(true); } }}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 ${voted ? 'text-[#00C4B4]' : 'text-[#5A6478] dark:text-white/50 hover:text-[#00C4B4]'}`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{votes} helpful</span>
              </button>
              <span className="text-xs text-[#5A6478] dark:text-white/30">{item.answers} answers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunityClient() {
  const [activeTag, setActiveTag] = useState('All');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filtered = activeTag === 'All' ? QA_DATA : QA_DATA.filter(q => q.tag === activeTag);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (question.trim().length > 10) {
      setSubmitted(true);
      setQuestion('');
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7] dark:bg-[#06192E]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#06192E] via-[#0A2540] to-[#13325F] pt-[100px] md:pt-[120px] pb-14 md:pb-20 text-white">
        <div aria-hidden className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#00C4B4]/15 blur-[120px] pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 -left-24 w-[400px] h-[400px] rounded-full bg-[#C9A14A]/10 blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#00C4B4]/10 border border-[#00C4B4]/25 text-[#5EEAD9] text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <Users className="w-3.5 h-3.5" /> Community
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            Real Questions.<br />
            <span style={{ background: 'linear-gradient(90deg,#00C4B4,#5EEAD9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Verified Answers.
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Ask about your visa application, browse thousands of answered questions, and get instant alerts when UK immigration rules change.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[['12,000+', 'Questions answered'], ['98%', 'Get a response'], ['Free', 'Always']].map(([stat, label]) => (
              <div key={label} className="flex flex-col items-center bg-white/6 rounded-2xl px-6 py-3">
                <span className="text-xl font-bold text-[#00C4B4]">{stat}</span>
                <span className="text-white/60 text-xs mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">

        {/* ── JOIN CHANNELS ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-[#00C4B4]" />
            <h2 className="text-xl font-bold text-[#0A2540] dark:text-white">Get Instant Visa Updates</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CHANNELS.map((ch) => (
              <a
                key={ch.name}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: ch.bg, borderColor: ch.border }}
              >
                <div className="text-3xl">{ch.icon}</div>
                <div>
                  <div className="font-bold text-[#0A2540] dark:text-white text-sm mb-1">{ch.name}</div>
                  <div className="text-xs text-[#5A6478] dark:text-white/60 leading-relaxed">{ch.desc}</div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: ch.border }}>
                  <span className="text-xs font-semibold" style={{ color: ch.color }}>{ch.stats}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all duration-150" style={{ color: ch.color }}>
                    {ch.cta} <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── ASK A QUESTION ── */}
        <section className="bg-gradient-to-br from-[#0A2540] to-[#13325F] rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-5">
            <MessageCircle className="w-5 h-5 text-[#00C4B4]" />
            <h2 className="text-xl font-bold">Ask a Question</h2>
          </div>
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-semibold text-lg mb-1">Question received!</p>
              <p className="text-white/70 text-sm">We typically respond within 24 hours. Check back here or follow our channels for the answer.</p>
              <button onClick={() => setSubmitted(false)} className="mt-4 text-[#00C4B4] text-sm font-semibold hover:underline">Ask another question</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. My Skilled Worker CoS was issued 3 months ago. Is it still valid for my application?"
                rows={4}
                required
                minLength={10}
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[#00C4B4]/60 focus:ring-2 focus:ring-[#00C4B4]/20 resize-none transition-colors"
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-white/45">Anonymous · Plain English answers · No legal advice</p>
                <button
                  type="submit"
                  disabled={question.trim().length < 10}
                  className="inline-flex items-center gap-2 bg-[#00C4B4] hover:bg-[#00A89A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors duration-150"
                >
                  <Send className="w-4 h-4" /> Submit Question
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ── Q&A BROWSE ── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#0A2540] dark:text-white">Browse Questions</h2>
            <span className="text-sm text-[#5A6478] dark:text-white/50">{QA_DATA.length} answered questions</span>
          </div>

          {/* Tag filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150 ${
                  activeTag === tag
                    ? 'bg-[#00C4B4] text-white border-[#00C4B4]'
                    : 'bg-white dark:bg-white/5 text-[#5A6478] dark:text-white/60 border-[#e8edf4] dark:border-white/10 hover:border-[#00C4B4]/40'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Q&A cards */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-[#5A6478] dark:text-white/50 py-12">No questions yet for this category.</p>
            ) : (
              filtered.map((item) => <QACard key={item.id} item={item} />)
            )}
          </div>
        </section>

        {/* ── DISCLAIMER ── */}
        <div className="text-xs text-center text-[#5A6478] dark:text-white/35 border-t border-[#e8edf4] dark:border-white/8 pt-8">
          Answers are for informational purposes only and not legal advice. Always verify information on{' '}
          <a href="https://www.gov.uk/browse/visas-immigration" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#00C4B4]">gov.uk</a>.
        </div>
      </div>
    </main>
  );
}
