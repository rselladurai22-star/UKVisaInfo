import type { Metadata } from 'next';
import EligibilityPage from './EligibilityPage';
import EditorByline from '../../components/EditorByline';

export const metadata: Metadata = {
  title: 'UK Visa Eligibility Checker, Find Your Route in 60 Seconds',
  description:
    'Free interactive quiz to find which UK visa you qualify for. Answer 4 questions about nationality, residence and purpose to get personalised visa recommendations.',
  alternates: { canonical: '/eligibility' },
  openGraph: {
    title: 'UK Visa Eligibility Checker',
    description:
      'Answer 4 questions to find the right UK visa route for you.',
    url: 'https://ukvisainfo.co.uk/eligibility',
  },
};

export default function Page() {
  return (
    <>
      <EligibilityPage />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <EditorByline verified="May 2026" prefix="Edited & verified by" />
      </div>
    </>
  );
}
