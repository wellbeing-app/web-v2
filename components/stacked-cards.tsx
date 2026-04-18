'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Footer } from './footer';

interface CardData {
  id: string;
  component: React.ReactNode;
}

interface StackedCardsProps {
  cards: CardData[];
}

function CardPill({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="w-full max-w-200 h-[70vh] bg-card border border-border rounded-4xl p-10 md:p-16 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar"
      style={style}
    >
      {children}
    </div>
  );
}

function StackingCard({ card, index }: { card: CardData; index: number }) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['end end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const filter = useTransform(scrollYProgress, (p) => `blur(${p * 6}px)`);

  return (
    <section
      ref={sectionRef}
      id={card.id}
      className="relative h-[200vh]"
      style={{ zIndex: index }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 will-change-transform">
        <motion.div
          className="w-full max-w-200 h-[70vh] flex items-center justify-center will-change-transform"
          style={{ scale, opacity, filter }}
        >
          <CardPill>{card.component}</CardPill>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCard({ card, index }: { card: CardData; index: number }) {
  return (
    <section
      id={card.id}
      className="relative h-dvh flex items-center justify-center px-4"
      style={{ zIndex: index }}
    >
      <CardPill>{card.component}</CardPill>
      <Footer />
    </section>
  );
}

/**
 * StackedCards — Apple-style showcase.
 *
 * Each non-final section is 200vh tall with a sticky h-screen stage inside.
 * Card N is pinned for the first 100vh of its section; during the second 100vh
 * Card N+1 (higher zIndex) slides up from below and covers it, while Card N
 * scales/blurs/fades to recede. Transforms are bound directly to scroll — the
 * smoothness comes from Lenis at the input layer, not from framer-motion spring
 * damping, so the animation tracks the scroll position exactly.
 */
export function StackedCards({ cards }: StackedCardsProps) {
  return (
    <div className="w-full">
      {cards.map((card, i) => {
        const isLast = i === cards.length - 1;
        return isLast ? (
          <FinalCard key={card.id} card={card} index={i} />
        ) : (
          <StackingCard key={card.id} card={card} index={i} />
        );
      })}
    </div>
  );
}
