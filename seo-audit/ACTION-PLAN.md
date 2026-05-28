# SEO Action Plan

Site: `https://cristopher-palacios.vercel.app` — Date: 2026-05-25

Estimated score impact if all CRITICAL + HIGH items are shipped: **+25 to +30 points** (55 → 80–85).

---

## CRITICAL — fix this week (blocks indexing)

### C1. Replace hardcoded canonical host with an env var
**Why**: Every canonical, `og:url`, JSON-LD `url`, sitemap entry, and `robots.txt` line points to `cristopherpalacios.dev`, which returns NXDOMAIN. Google will treat the live URL as a non-canonical mirror of a non-existent origin.

**How**:
1. Add to `.env.local` and Vercel env (Production, Preview, Development):
   ```
   NEXT_PUBLIC_SITE_URL=https://cristopher-palacios.vercel.app
   ```
   (or the real custom domain once registered)
2. Replace all 17+ hardcoded occurrences. Centralize in `src/lib/site.ts`:
   ```ts
   export const SITE_URL =
     process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
     'https://cristopher-palacios.vercel.app';
   ```
3. Update each file to import `SITE_URL`:
   - [src/app/layout.tsx:41,82,116](src/app/layout.tsx#L41)
   - [src/app/about/layout.tsx:9,15](src/app/about/layout.tsx#L9)
   - [src/app/blog/page.tsx:13,18](src/app/blog/page.tsx#L13)
   - [src/app/blog/[slug]/page.tsx:134,139,162](src/app/blog/[slug]/page.tsx#L134)
   - [src/app/schema.tsx](src/app/schema.tsx) (5 occurrences)
   - [src/app/sitemap.ts:5](src/app/sitemap.ts#L5)
4. Delete `public/robots.txt` and create [src/app/robots.ts](src/app/robots.ts):
   ```ts
   import { MetadataRoute } from 'next';
   import { SITE_URL } from '@/lib/site';
   export default function robots(): MetadataRoute.Robots {
     return {
       rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
       sitemap: `${SITE_URL}/sitemap.xml`,
     };
   }
   ```

**Verification**: after deploy, `curl https://cristopher-palacios.vercel.app/sitemap.xml | grep loc` should show the actual host on every line.

**Effort**: ~1 hour. **Impact**: massive — unblocks Technical, On-Page, Schema, AI scores simultaneously.

---

### C2. Decide on the canonical domain
**Why**: Even after C1, Google needs one stable canonical. Options:

- **Register `cristopherpalacios.dev`** and connect to Vercel → set `NEXT_PUBLIC_SITE_URL=https://cristopherpalacios.dev`. Best long-term: branded, transferable.
- **Keep `cristopher-palacios.vercel.app` as canonical** → fine for now, but Vercel preview URLs can change and `.vercel.app` is downranked by some engines.

**Effort**: 30 min (register) + DNS propagation. **Impact**: prerequisite for sustainable SEO.

---

## HIGH — fix within 1 week

### H1. Add `<h1>` to blog index and blog post template
**File**: [src/app/blog/page.tsx](src/app/blog/page.tsx) — promote the visible "Blog" heading from H2 to H1.
**File**: [src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx) — render `post.title` as `<h1>` instead of `<h2>`.

**Effort**: 15 min. **Impact**: H1 is a primary on-page ranking signal; missing H1 is one of the most common audit failures.

---

### H2. Fix homepage `<h1>` text
**Why**: rendered text is `CristopherPalacios` (one concatenated word, no spaces, no keyword phrase).
**How**: in the home Hero, change the H1 to a real phrase: `Cristopher Palacios — Full Stack & AI Developer`. Keep the stylized brand wordmark as a decorative `<span>` or `<p>` with `aria-hidden`.
**Effort**: 15 min. **Impact**: brand + primary keyword in H1.

---

### H3. Fix `inLanguage` claim or implement real bilingual routing
**File**: [src/app/schema.tsx](src/app/schema.tsx) — `WebSite.inLanguage: ['en','es']`.

Two viable paths:
- **Quick**: change to `inLanguage: 'en'` (single canonical language) and drop the EN/ES toggle from SEO claims. Keeps the client-side i18n for UX only.
- **Proper**: migrate to App Router segments `/en/*` and `/es/*`, set `<html lang>` per route, emit `<link rel="alternate" hreflang="...">` per page.

**Effort**: 15 min (quick) / ~1 day (proper). **Impact**: stops sending mixed signals to crawlers.

---

### H4. Add a Content Security Policy
**Where**: [next.config.js / middleware.ts](next.config.js).
Start with Report-Only:
```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://us.i.posthog.com https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://us.i.posthog.com https://*.vercel-analytics.com;
  font-src 'self' data:;
  frame-ancestors 'none';
```
Tune for ~1 week against the violation reports, then promote to enforcing.

**Effort**: 1 hour to draft + 1 week of monitoring. **Impact**: closes the only remaining security-header gap; small ranking signal but a strong baseline.

---

### H5. Add `<h2>`/`<h3>` structure to `/about`
**Why**: 1,745 words with zero subheadings. Bad for readers, AI summarizers, and rich result snippets.
**How**: split the About content (in `text-content-en.json` / `text-content-es.json`) into sections like *Background*, *What I'm working on*, *Tech I lean on*, *Outside of work*, *Get in touch*, and wire them through MUI `Typography variant="h2"`.

**Effort**: 1–2 hours. **Impact**: lifts Content + On-Page; enables AI passage-level citation.

---

## MEDIUM — fix within 1 month

### M1. Ship `llms.txt`
Add [src/app/llms.txt/route.ts](src/app/llms.txt/route.ts) (or `public/llms.txt`) listing the homepage, About, Blog, and top posts in `# H1` + bullet format per the llms.txt spec. Helps Perplexity / ChatGPT / Claude citations. **Effort**: 1 hour.

### M2. Add a visible author byline on blog posts
Currently the author is only inside `BlogPosting.author` JSON-LD. Render a small author card (photo, name, role, link to About) above or below the post body. **Effort**: 1 hour. **Impact**: E-E-A-T.

### M3. Add `BreadcrumbList` JSON-LD on `/about`, `/blog`, and posts
Wire into [src/app/schema.tsx](src/app/schema.tsx) as a per-page injector. **Effort**: 1 hour.

### M4. Add `ItemList` JSON-LD on `/blog`
Lists all posts in order — helps Google understand the index. **Effort**: 30 min.

### M5. Remove or implement `WebSite.SearchAction`
Either delete the `potentialAction` from `WebSite` schema (no real search endpoint exists), or implement `/?q=...` to serve search results. **Effort**: 15 min to remove.

### M6. Add TL;DR / "Key takeaways" block at top of each blog post
2–3 sentence summary that AI engines can cite verbatim. Add it as a markdown front-matter field `summary:` and render at top. **Effort**: 1 hour template + ongoing per post.

### M7. Lazy-load Three.js / GSAP / Lenis where they aren't above-the-fold
Use `next/dynamic` with `ssr: false`. Cuts initial JS payload. **Effort**: 2–4 hours. **Impact**: LCP/INP.

### M8. Verify `sameAs` profile back-links
LinkedIn, GitHub, dev.to should link back to the canonical homepage. **Effort**: 15 min.

---

## LOW — backlog

### L1. Add `theme-color` meta
For mobile browser chrome. Already in manifest; mirror in `<head>` via `themeColor` in Next metadata. **Effort**: 5 min.

### L2. Add `public/manifest.json` → 308 → `/manifest.webmanifest` (if any external doc links to `.json`)
Only if you have external references to it. **Effort**: 5 min.

### L3. Add internal "related posts" links at the bottom of each blog post
**Effort**: 2 hours.

### L4. Drop trailing `| Cristopher Palacios` from the `/about` `<title>` (currently duplicated at start and end)
**File**: [src/app/about/layout.tsx](src/app/about/layout.tsx). **Effort**: 2 min.

### L5. Add FAQPage schema to `cooperativas-ecuador-plazo-fijo-riesgo-rentabilidad`
This post has clear Q/A potential. **Effort**: 30 min.

### L6. Consider deleting unused image carousels (`react-slick`, `react-responsive-carousel`, `react-perfect-scrollbar`) if not actively used
Bundle weight win. **Effort**: depends.

---

## Implementation order (recommended)

1. **Day 1**: C1 + C2 + H1 + H2 + H4 — most impact, all small.
2. **Day 2–3**: H3 + H5 + M1 + M5.
3. **Week 2**: M2, M3, M4, M6, M8.
4. **Week 3–4**: M7 + perf re-test + Lighthouse/PSI run.
5. **Backlog**: L1–L6.

### Verification after each phase

```bash
# Canonical sanity
curl -s https://cristopher-palacios.vercel.app/ | grep -oE 'rel="canonical" href="[^"]+"'
curl -s https://cristopher-palacios.vercel.app/sitemap.xml | grep -oE '<loc>[^<]+</loc>'

# Headings sanity
curl -s https://cristopher-palacios.vercel.app/blog/building-fullstack-app-nextjs-ai \
  | grep -oE '<h1[^>]*>[^<]*</h1>'

# Re-score
# rerun /claude-seo:seo-audit after the C1+H1+H2 fixes are deployed
```
