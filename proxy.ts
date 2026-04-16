import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "cs"];
const defaultLocale = "en"; // Default to English for international users
const localeCookieName = "locale";

function getLocaleFromCookie(request: NextRequest): string | undefined {
  const cookie = request.cookies.get(localeCookieName)?.value;
  if (cookie && locales.includes(cookie)) {
    return cookie;
  }
  return undefined;
}

function getLocaleFromAcceptLanguage(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return matchLocale(languages, locales, defaultLocale);
  } catch {
    return undefined;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // 1. Check cookie preference first
    let locale = getLocaleFromCookie(request);

    // 2. Fall back to Accept-Language header
    if (!locale) {
      locale = getLocaleFromAcceptLanguage(request);
    }

    // 3. Use default locale (en)
    if (!locale) {
      locale = defaultLocale;
    }

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
