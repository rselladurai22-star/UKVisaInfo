import type { Metadata } from 'next';
import RefusalAnalyzerClient from './RefusalAnalyzerClient';

export const metadata: Metadata = {
  title: 'UK Visa Refusal Analyzer — Decode Your Refusal Letter (Free)',
  description: 'Paste your UK visa refusal letter and get a plain-English breakdown of what each ground means, how serious it is, and what to do next. Free, private, no signup.',
  alternates: { canonical: '/tools/refusal-analyzer' },
  openGraph: {
    title: 'UK Visa Refusal Analyzer',
    description: 'Decode your UK visa refusal letter into plain English. Free and private — text never leaves your browser.',
    url: 'https://ukvisainfo.co.uk/tools/refusal-analyzer',
  },
};

export default function RefusalAnalyzerPage() {
  return <RefusalAnalyzerClient />;
}
