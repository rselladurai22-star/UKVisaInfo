'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';

interface Props {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedCounter({ to, prefix = '', suffix = '', duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: [0.22, 1, 0.36, 1] });
      return () => controls.stop();
    }
  }, [inView, to, count, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
