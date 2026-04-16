---
name: localization-improvements
description: Implemented locale detection, cookie-based preference, and hreflang tags for multi-language support
type: project
---

**Implemented multi-language localization improvements:**

1. **Locale detection in proxy.ts** (Next.js proxy pattern, not middleware):
   - Cookie-based locale preference (`locale` cookie, checked first)
   - Accept-Language header detection via `negotiator` as fallback
   - Default to English (`en`) for international users
   - Redirects unprefixed paths to locale-prefixed versions (`/en`, `/cs`)

2. **Enhanced LanguageSwitcher** (`components/language-switcher.tsx`):
   - Sets locale cookie when switching languages (persists 1 year)
   - Uses React transitions for smoother UX
   - Disabled state during page transition

3. **SEO improvements** (`app/[lang]/metadata.ts`):
   - hreflang tags for `en` and `cs` locales
   - Canonical URLs
   - Static page generation with shared metadata

**Why:** Users visiting without Czech locale were redirected to `/cs` with no visible language indicator, creating poor UX for non-Czech speakers.

**How to apply:** All locale handling is in `proxy.ts`. Cookie `locale` persists user preference across sessions. Default fallback changed from Czech to English for better international UX.