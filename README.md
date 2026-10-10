# Prakash Karekar — Engineered to work

A local, deployable Next.js App Router portfolio with React, strict TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Lenis, React Three Fiber, Three.js, Drei, Motion, and Lucide.

## Run

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Content lives in `src/data/portfolio.ts`; design tokens and responsive layouts are in `src/app/globals.css`. The sculpture and network share a lazy-loaded WebGL module. The two scenes only mount near the viewport, use capped DPR, and are disabled on mobile and when reduced motion is requested. CSS geometry provides a fallback. Layer navigation is keyboard accessible; left/right arrows, Home, and End select layers.

## Verify

```sh
npm run build
npm run typecheck
npm run test:browser
```

Browser tests require Python 3 (static test server) and installed Google Chrome. To use bundled Chromium instead, remove `channel: 'chrome'` from `playwright.config.ts` and run `npx playwright install chromium`. Tests cover all project routes, desktop WebGL, mobile menu and overflow, layer keyboard selection, synthetic security controls, reduced motion, unavailable WebGL, and basic navigation with JavaScript disabled.

## Deploy

Set `SITE_URL` to the final public origin, without a trailing slash, in `.env.local` before building. No origin is fabricated: without this setting, the sitemap intentionally has no URL entries. Run `npm run build`; deploy the resulting **out/** directory to any static host with directory index support (Cloudflare Pages, Netlify, GitHub Pages with an appropriate base path, or an ordinary Nginx server). Vercel can also build the Next.js source. There are no server functions, database, secrets, or contact-form services. Email uses a `mailto:` link.

For Nginx, set the site root to the exported directory and use `try_files $uri $uri/ =404;`. Serve `404.html` as the error page. For a subdirectory deployment, configure Next.js `basePath` and adjust absolute public asset paths before rebuilding. Preview the static export with `npm run preview` (Python 3 required), then open http://127.0.0.1:4173.

## Content provenance

Professional facts were extracted from `D:/Skills/REUMES/software/Prakash_Karekar_Software.pdf`, matching the filename in the supplied brief. Employer chronology, responsibilities, project outcomes, education, leadership, and six certification titles follow that source. Current certification validity is not asserted. The resume's approximate security improvements are labeled as reported. Technology names missing from a particular project's resume entry are not assigned to that project.

The first three project diagrams are original, explicitly conceptual illustrations, not screenshots or exact infrastructure maps. Merlin uses a genuine browser screenshot captured from its live website on 10 October 2026, compressed to WebP. Synthetic security scores are fixed illustrative values, not a password-strength estimator. No credentials or breached datasets are included. External destinations are the resume-provided URLs; third-party availability is outside this site's control.

## Art and motion

Ivory, graphite, muted olive-gray, and sparse copper; oversized Geist typography with rare Instrument Serif accents. A segmented PBR mechanical ring encloses a wireframe core. Original geometry and deterministic particles require no downloaded models or copied component code. Originkit and Casberry Particles were reviewed as references; neither is embedded or a runtime dependency. GSAP handles the introductory line masks, section reveals, reading progress and experience line; Lenis is synchronized to the GSAP ticker. Motion is restricted to the selected-layer text transition. All animation honors reduced motion.

Fonts are downloaded at build time by `next/font` and served locally. A network connection to Google Fonts is therefore needed for the first build. The Open Graph image is supplied as a PNG with editable SVG source.

## Verification — 10 October 2026

Production build and strict TypeScript checks passed. All four Playwright scenarios passed, covering the homepage and four case studies, real desktop WebGL, keyboard controls, mobile navigation, no horizontal overflow at 320/390/768/1440px, reduced motion, no WebGL, and basic navigation without JavaScript. The desktop route test checks for runtime exceptions and failed local HTTP requests. Axe reported no WCAG A/AA violations in the tested mobile homepage and desktop case-study states; automated checks do not constitute a full accessibility audit.

In local Chrome at a 390×844 viewport, reduced motion enabled, and a 4× CPU slowdown, observed LCP was 2.78 seconds and CLS was 0. This is a local lab observation, not a field Core Web Vitals score or a physical-device measurement. Check real devices and the deployed host before relying on performance targets.

ThetaTracker, CertifyPro, and Merlin responded successfully during direct browser checks. Rotra timed out after 20 seconds; its resume-provided URL is retained. No source was published or pushed.
