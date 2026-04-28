'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import ScrollToTop from './ScrollToTop';
import NewsTicker from './NewsTicker';
import ApplyWizard from './ApplyWizard';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-secondary/10 selection:text-secondary">
      <ScrollProgress />
      <Header onApply={() => setApplyOpen(true)} />
      <div className="pt-20">
        <NewsTicker />
      </div>

      <main className="flex-grow">{children}</main>

      <Footer />
      <ScrollToTop />
      <ApplyWizard open={applyOpen} onClose={() => setApplyOpen(false)} />
    </div>
  );
}
