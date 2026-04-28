'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setVisible(y > 400);
  });

  // Avoid SSR flicker
  useEffect(() => {
    setVisible(window.scrollY > 400);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', damping: 18, stiffness: 300 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white shadow-2xl hover:bg-secondary transition-colors flex items-center justify-center z-50 ring-4 ring-white/20"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
