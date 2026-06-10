'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import ScrollToTop from './ScrollToTop';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-secondary/15 selection:text-secondary">
      <ScrollProgress />
      <Header />

      <main className="flex-grow">{children}</main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
