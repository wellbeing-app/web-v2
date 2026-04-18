'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useLenis } from './providers/smooth-scroll';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'vision', label: 'Vision' },
  { id: 'features', label: 'Features' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
];

export function ScrollIndicator() {
  const [activeId, setActiveId] = useState<string>('home');
  const elementsCache = useRef<Record<string, HTMLElement>>({});
  const lenisRef = useLenis();

  const determineActiveSection = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (window.scrollY < 50) {
      setActiveId('home');
      return;
    }

    const triggerPoint = window.innerHeight / 2;
    let foundId = sections[0].id;

    for (const section of sections) {
      let element = elementsCache.current[section.id];
      if (!element) {
        const el = document.getElementById(section.id);
        if (el) {
          element = el;
          elementsCache.current[section.id] = el;
        }
      }

      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
          foundId = section.id;
        }
      }
    }

    setActiveId(foundId);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', determineActiveSection, { passive: true });
    const rafId = requestAnimationFrame(determineActiveSection);
    const timer = setTimeout(determineActiveSection, 100);

    return () => {
      window.removeEventListener('scroll', determineActiveSection);
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [determineActiveSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(element, { offset: 0, duration: 1.4 });
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-2 p-2 rounded-full glass border border-border/50"
      aria-label="Progress navigation"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={`
            w-2 rounded-full transition-all duration-300 ease-out cursor-pointer
            ${activeId === id ? 'h-5 bg-foreground' : 'h-2 bg-foreground/20 hover:bg-foreground/50'}
          `}
          title={label}
          aria-label={`Scroll to ${label}`}
          aria-current={activeId === id ? 'true' : undefined}
        />
      ))}
    </nav>
  );
}
