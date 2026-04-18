'use client';

import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
import Lenis from 'lenis';

type LenisRef = RefObject<Lenis | null>;

const LenisContext = createContext<LenisRef>({ current: null });

export const useLenis = (): LenisRef => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useLayoutEffect(() => {
    const instance = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = instance;

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
