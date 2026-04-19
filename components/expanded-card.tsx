'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ExpandedCardProps {
  children: React.ReactNode;
  layoutId: string;
}

const CLOSE_FADE_MS = 180;

export function ExpandedCard({ children, layoutId }: ExpandedCardProps) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      router.back();
    }, CLOSE_FADE_MS);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: closing ? CLOSE_FADE_MS / 1000 : 0.2, ease: 'easeOut' }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
    >
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl cursor-zoom-out"
      />

      <motion.div
        layoutId={closing ? undefined : layoutId}
        data-lenis-prevent
        className="relative w-full max-w-5xl h-[90vh] bg-card border border-border rounded-4xl shadow-2xl overflow-y-auto no-scrollbar"
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 30,
        }}
      >
        <button
          onClick={handleClose}
          className="sticky top-6 right-6 ml-auto mr-6 flex items-center justify-center p-3 rounded-2xl glass border border-border/50 bg-secondary/20 text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary/40 transition-all duration-300 cursor-pointer z-50"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="px-6 pb-20 md:px-16 md:pb-32">{children}</div>
      </motion.div>
    </motion.div>
  );
}
