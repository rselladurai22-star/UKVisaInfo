'use client';

import { useRouter } from 'next/navigation';
import EligibilityQuiz from '../../components/EligibilityQuiz';

export default function EligibilityPage() {
  const router = useRouter();
  return <EligibilityQuiz onCancel={() => router.push('/')} />;
}
