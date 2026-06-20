'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import ApplyWizard from './ApplyWizard';
import CommentsGate from './CommentsGate';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-secondary/15 selection:text-secondary">
      <Header />

      <main className="flex-grow">
        {children}
        <CommentsGate />
      </main>

      <Footer />
      <ScrollToTop />
      <ApplyWizard open={applyOpen} onClose={() => setApplyOpen(false)} />
    </div>
  );
}
