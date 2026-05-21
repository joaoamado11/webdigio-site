# Webdigio v5 Changelog

## 2026-05-21 — Auth overhaul, UI polish, content humanization

### Auth & Data Layer
- Replaced Supabase Auth + @supabase/ssr with custom DB-backed authentication
- New `admin_users` table in Supabase for credential storage
- Hardcoded credential fallback ensures login always works
- Removed all @supabase/ssr from the project — eliminated BOM header bug permanently
- Switched to simple @supabase/supabase-js createClient for all data access
- Added module-level caching for site_content in server components
- Admin API routes use custom getAdminUser() instead of Supabase Auth

### UI Changes
- Removed "Scroll para ver como ficaria o teu site" from hero
- Moved hero headline ("O teu negocio merece um site melhor") higher on screen (top 4%)
- Added RotatingText component to WhyWebdigio section with character-level spring animations
- Replaced hero background video system: 4 random web design/dev/marketing videos, picks one per page load
- Video URLs editable from admin panel (Content > Hero > hero.video_urls)

### Content Humanization
- Rewrote 20+ translation strings across EN and PT
- Removed AI patterns: "premium", "sem complicacoes", "incrivel", inflated corporate speak, em dashes, tailing negations, rule-of-three patterns
- Portuguese tuned for European PT audience
- English rewritten to sound like a real agency

### Bug Fixes
- Fixed admin login stuck at "Signing in..." (BOM header crash)
- Fixed admin sections (SEO, Services, Chatbot, Pricing) showing empty data
- Fixed admin panel slowness from @supabase/ssr cookie handling
- Fixed inner hero video not showing (broken Pexels URLs)

### Tech Stack
- Next.js 15.5, React 19.2, Tailwind v4, Supabase, Framer Motion
- Deployed at https://webdigio.com (prod) / https://webdigio-staging.vercel.app (staging)
