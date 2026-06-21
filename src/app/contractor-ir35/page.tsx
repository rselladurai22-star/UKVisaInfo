import type { Metadata } from 'next';
import ContractorIR35 from './ContractorIR35';

export const metadata: Metadata = {
  title: 'Contractor IR35 Calculator 2025/26, Inside vs Outside | UKDesk',
  description:
    'Free UK contractor IR35 calculator. Compare take-home as a limited-company contractor outside IR35 versus inside IR35 / umbrella, with Corporation Tax, dividends, NI and employer NI on 2025/26 rates.',
  alternates: { canonical: '/contractor-ir35' },
  openGraph: { title: 'Contractor IR35 Calculator 2025/26', description: 'Take-home inside vs outside IR35 for contractors.', url: 'https://ukvisainfo.co.uk/contractor-ir35', type: 'article' },
};

export default function Page() {
  return <ContractorIR35 />;
}
