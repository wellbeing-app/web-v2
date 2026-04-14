"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar({ dict, lang }: { dict: { nav: Record<string, string> }; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.nav_home },
    { href: `/${lang}#manifest`, label: dict.nav.nav_manifest },
    { href: `/${lang}#waitlist`, label: dict.nav.nav_waitlist },
    { href: `/${lang}#contact`, label: dict.nav.nav_contact },
  ];

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <nav className="glass px-6 py-3 rounded-full flex items-center justify-between border border-border">
          <Link href={`/${lang}`} className="text-xl font-bold tracking-tight">
            Wellbeing
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover:bg-secondary/50 px-3 py-1.5 rounded-full"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-full">
              <LanguageSwitcher lang={lang} />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-full">
              <LanguageSwitcher lang={lang} />
              <ThemeToggle />
            </div>
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[95%] z-40 md:hidden glass rounded-3xl p-6 border border-border flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg font-medium py-3 px-6 hover:bg-secondary/50 w-full text-center rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
