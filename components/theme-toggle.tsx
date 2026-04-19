'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const THEME_TRANSITION_MS = 500;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const toggle = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.add('theme-switching');
    setTheme(next);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      root.classList.remove('theme-switching');
      timerRef.current = null;
    }, THEME_TRANSITION_MS);
  };

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full hover:bg-secondary/50 transition-all duration-300 flex items-center justify-center text-foreground/80 hover:text-foreground cursor-pointer"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
