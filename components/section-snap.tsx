'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from './providers/smooth-scroll';

interface SectionSnapProps {
  sectionIds: readonly string[];
  duration?: number;
}

const ADVANCE_LOCK_MS = 650;
const WHEEL_THRESHOLD = 4;
const TOUCH_THRESHOLD_PX = 40;

export function SectionSnap({ sectionIds, duration = 0.9 }: SectionSnapProps) {
  const lenisRef = useLenis();
  const lockUntilRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const getTops = () =>
      sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return el.getBoundingClientRect().top + window.scrollY;
        })
        .filter((top): top is number => top !== null)
        .sort((a, b) => a - b);

    const currentIndex = (tops: number[]) => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= y) idx = i;
      }
      return idx;
    };

    const advance = (direction: 1 | -1) => {
      const now = performance.now();
      if (now < lockUntilRef.current) return;
      const lenis = lenisRef.current;
      if (!lenis) return;
      const tops = getTops();
      if (tops.length === 0) return;
      const idx = currentIndex(tops);
      const target = Math.max(0, Math.min(tops.length - 1, idx + direction));
      if (target === idx) return;
      lockUntilRef.current = now + ADVANCE_LOCK_MS;
      lenis.scrollTo(tops[target], { duration, lock: true });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      e.stopPropagation();
      advance(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        advance(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        advance(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        const lenis = lenisRef.current;
        if (lenis) {
          lockUntilRef.current = performance.now() + ADVANCE_LOCK_MS;
          lenis.scrollTo(0, { duration, lock: true });
        }
      } else if (e.key === 'End') {
        e.preventDefault();
        const lenis = lenisRef.current;
        const tops = getTops();
        if (lenis && tops.length > 0) {
          lockUntilRef.current = performance.now() + ADVANCE_LOCK_MS;
          lenis.scrollTo(tops[tops.length - 1], { duration, lock: true });
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const dy = touchStartYRef.current - (e.touches[0]?.clientY ?? touchStartYRef.current);
      if (Math.abs(dy) < TOUCH_THRESHOLD_PX) return;
      touchStartYRef.current = null;
      e.preventDefault();
      advance(dy > 0 ? 1 : -1);
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [sectionIds, duration, lenisRef]);

  return null;
}
