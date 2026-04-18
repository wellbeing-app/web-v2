'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useLenis } from './providers/smooth-scroll';
import { useEffect } from 'react';

interface ExpandedCardProps {
  children: React.ReactNode;
  layoutId: string;
}

export function ExpandedCard({ children, layoutId }: ExpandedCardProps) {
  const router = useRouter();
  const lenis = useLenis();

  // Disable scroll when expanded
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
    >
      {/* Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => router.back()}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl cursor-zoom-out"
      />

      {/* Expanded Content */}
      <motion.div
        layoutId={layoutId}
        data-lenis-prevent
        className="relative w-full max-w-5xl h-[90vh] bg-card border border-border rounded-4xl shadow-2xl overflow-y-auto no-scrollbar"
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 30,
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="sticky top-6 right-6 ml-auto mr-6 flex items-center justify-center p-3 rounded-2xl glass border border-border/50 bg-secondary/20 text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary/40 transition-all duration-300 cursor-pointer z-50"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="px-6 pb-20 md:px-16 md:pb-32">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
