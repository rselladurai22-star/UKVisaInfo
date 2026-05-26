import type { Metadata } from 'next';
import VisaSwitchingClient from '../../components/VisaSwitchingClient';
import EditorByline from '../../components/EditorByline';

export const metadata: Metadata = {
  title: 'UK Visa Switching Guide 2026 — Switch Inside UK Without Leaving',
  description:
    'Switch between UK visas without leaving the country. From Student to Graduate, Graduate to Skilled Worker, Skilled Worker to Family, and more. Interactive switching matrix, in-UK fees, section 3C leave and step-by-step guidance — gov.uk verified.',
  alternates: { canonical: '/visa-switching' },
  openGraph: {
    title: 'UK Visa Switching Guide 2026 — Switch Inside UK Without Leaving',
    description:
      'Interactive visa-to-visa switching matrix. See which routes you can switch into from your current UK visa, with fees, conditions and section 3C protection.',
    url: 'https://ukvisainfo.co.uk/visa-switching',
  },
};

export default function Page() {
  return (
    <>
      <VisaSwitchingClient />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <EditorByline verified="May 2026" prefix="Edited & verified by" />
      </div>
    </>
  );
}
