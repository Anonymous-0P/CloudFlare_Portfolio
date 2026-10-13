# Prakash Karekar — Engineered to work

A local, deployable Next.js App Router portfolio with React, strict TypeScript, Tailwind CSS, GSAP/ScrollTrigger/ScrollSmoother, @gsap/react, React Three Fiber, Three.js, Drei, and Lucide.

## Run

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Content lives in `src/data/portfolio.ts`; design tokens and responsive layouts are in `src/app/globals.css`. The Engineering Core uses a lazy-loaded WebGL module, mounts only in the viewport while the document is visible, caps DPR at 1.35, and is disabled on mobile, reduced motion, and data-saving connections. Inline SVG provides an immediate static fallback. The architecture section uses a lightweight SVG diagram with no second WebGL context. Layer navigation is keyboard accessible; left/right arrows, Home, and End select layers.

## Verify

```sh
npm run build
npm run typecheck
npm run test:browser
npm run test:dev
```

Browser tests require Python 3 (static test server) and installed Google Chrome. To use bundled Chromium instead, remove `channel: 'chrome'` from `playwright.config.ts` and run `npx playwright install chromium`. Tests cover all project routes, desktop WebGL, mobile menu and overflow, layer keyboard selection, synthetic security controls, reduced motion, unavailable WebGL, and basic navigation with JavaScript disabled.

## Deploy

Set `SITE_URL` to the final public origin, without a trailing slash, in `.env.local` before building. No origin is fabricated: without this setting, the sitemap intentionally has no URL entries. Run `npm run build`; deploy the resulting **out/** directory to any static host with directory index support (Cloudflare Pages, Netlify, GitHub Pages with an appropriate base path, or an ordinary Nginx server). Vercel can also build the Next.js source. There are no server functions, database, secrets, or contact-form services. Email uses a `mailto:` link.

For Nginx, set the site root to the exported directory and use `try_files $uri $uri/ =404;`. Serve `404.html` as the error page. For a subdirectory deployment, configure Next.js `basePath` and adjust absolute public asset paths before rebuilding. Preview the static export with `npm run preview` (Python 3 required), then open http://127.0.0.1:4173.

## Content provenance

Professional facts were extracted from `D:/Skills/REUMES/software/Prakash_Karekar_Software.pdf`, matching the filename in the supplied brief. Employer chronology, responsibilities, project outcomes, education, leadership, and six certification titles follow that source. Current certification validity is not asserted. The resume's approximate security improvements are labeled as reported. Technology names missing from a particular project's resume entry are not assigned to that project.

The first three project diagrams are original, explicitly conceptual illustrations, not screenshots or exact infrastructure maps. Merlin uses a genuine browser screenshot captured from its live website on 10 October 2026, compressed to WebP. Synthetic security scores are fixed illustrative values, not a password-strength estimator. No credentials or breached datasets are included. External destinations are the resume-provided URLs; third-party availability is outside this site's control.

## Art and motion

Ivory, graphite, muted olive-gray, and sparse copper; oversized Geist typography with rare Instrument Serif accents. A procedural CPU assembly with 48 instanced contact pins, layered metallic surfaces, circuit traces, and six system nodes replaces the former mechanical ring. No textures, downloaded models, particles, or postprocessing are required. Pointer movement and scroll rotate the core; scroll separates its lid. Visible HTML controls provide the same node selection as the decorative canvas.

GSAP owns desktop ScrollSmoother, line masks, section reveals, timeline progress, project diagram entrances, screenshot parallax, and metric count-ups. Native touch scrolling is preserved. Shared React context connects core selection and the architecture diagram; a mutable ref supplies per-frame scroll progress without per-frame React renders. Manual layer selection takes priority until leaving the engineering section. Reduced motion disables smoothing, scroll-driven selection, animated counts, and WebGL. useGSAP and matchMedia revert animation contexts on cleanup. Anchors and history remain browser-owned.

Fonts are downloaded at build time by `next/font` and served locally. A network connection to Google Fonts is therefore needed for the first build. The Open Graph image is supplied as a PNG with editable SVG source.

## Previous baseline verification — 10 October 2026

Production build and strict TypeScript checks passed. All four Playwright scenarios passed, covering the homepage and four case studies, real desktop WebGL, keyboard controls, mobile navigation, no horizontal overflow at 320/390/768/1440px, reduced motion, no WebGL, and basic navigation without JavaScript. The desktop route test checks for runtime exceptions and failed local HTTP requests. Axe reported no WCAG A/AA violations in the tested mobile homepage and desktop case-study states; automated checks do not constitute a full accessibility audit.

In local Chrome at a 390×844 viewport, reduced motion enabled, and a 4× CPU slowdown, observed LCP was 2.78 seconds and CLS was 0. This is a local lab observation, not a field Core Web Vitals score or a physical-device measurement. Check real devices and the deployed host before relying on performance targets.

ThetaTracker, CertifyPro, and Merlin responded successfully during direct browser checks. Rotra timed out after 20 seconds; its resume-provided URL is retained. No source was published or pushed.

## Upgrade audit — 13 October 2026

The retained codebase is Next.js App Router with static export, React 19, strict TypeScript, Tailwind/PostCSS and global CSS. It contains a homepage with ten sections, four generated case studies, a not-found page, metadata, robots and sitemap routes. Content remains in `src/data/portfolio.ts`; none of the project facts, employer chronology, certifications, contact destinations, or metrics were changed.

The baseline already had semantic sections, mobile navigation, focus styles, lazy WebGL, reduced-motion handling and Playwright/axe checks. Gaps found: generic ring/particle geometry with no engineering narrative; a second continuously rendered WebGL network; click-only architecture; no section-aware navigation; no Escape dismissal; no count-up implementation; and very small mobile labels and descriptions. Existing factual provenance and the real Merlin screenshot are preserved.

Design direction: retain ivory, graphite, olive and copper, Geist typography and Instrument Serif accents. Separate the hero headline and core into balanced columns, then stack text and the static processor on mobile. Keep the existing editorial approach, numbered case studies, timeline, security demo, technical index and contact composition.

Component architecture:

- `motion-shell.tsx`: responsive GSAP lifecycle, desktop smoother and reusable reveal/diagram/count selectors.
- `system-state.tsx`: shared layer selection and scroll progress.
- `hero-core.tsx`: accessible layer controls and contextual description.
- `scene-loader.tsx`: dynamic import, SVG fallback, visibility and capability gates.
- `sculpture.tsx`: procedural CPU, instanced pins, circuit connections and context-loss handling.
- `engineering.tsx`: SVG request/response diagram, scroll activation and keyboard tabs.
- Existing navigation, projects, security demo and content modules remain in place.

Dependency changes: add `@gsap/react`; remove Lenis and Motion so one animation system owns the page. ScrollSmoother is included in the existing GSAP dependency. Next.js, React, Three.js, Fiber, Drei, Lucide and test/build tooling are retained.

## Model evaluation

The supplied Sketchfab URLs returned HTTP 403 during research, so download availability, file size, geometry and license could not be verified:

- [Motherboard and Components](https://sketchfab.com/3d-models/motherboard-components-3bc94057328243d4b341a55f59160f8a)
- [Low-poly Server Rack](https://sketchfab.com/3d-models/server-rack-1348f8c5313f4059b9a2b5b3f37c81f3)
- [Server Rack](https://sketchfab.com/3d-models/server-rack-62f6779cb7e448b19aaf58544c3c7218)

Reviewed the [Three.js glTF examples](https://threejs.org/examples/?q=gltf) and [R3F gltfjsx tooling](https://github.com/pmndrs/gltfjsx). These provide integration/optimization paths but do not establish licensing for the supplied assets. Selected original procedural geometry for visual coherence, zero model downloads and no external model attribution requirements. The live portfolio origin was also unavailable through the research browser; the local source is the audit baseline.

Implementation references: [GSAP ScrollSmoother](https://gsap.com/docs/v3/Plugins/ScrollSmoother/) and [R3F performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).

## Production deployment checklist

- Build with `SITE_URL=https://prakashkarekar.dpdns.org` (or the actual destination) and run the production browser suite.
- Upload the complete `out/` directory to the existing static host, preserving directory-index routing.
- Serve `404.html` for missing routes; verify all four `/work/<slug>/` URLs directly.
- Check HTTPS, sitemap origin, social preview image, fonts, images, external project links and mailto on the deployed domain.
- Smoke-test mobile Safari/Chrome, keyboard navigation, reduced motion and WebGL unavailable.
- Run Lighthouse on the deployed host and test physical lower-powered devices. Local CPU throttling does not establish field Core Web Vitals.
- Keep the previous release available for rollback; check HTML cache invalidation and immutable caching for hashed assets.

This task prepares the static release locally; it does not alter the existing domain or hosting configuration.

## Upgrade verification — 13 October 2026

The production export and TypeScript build checks passed. The six-scenario Playwright suite passed in local Google Chrome, including all four case-study routes, real desktop WebGL, core controls, scroll-driven layer changes, manual-selection priority, back/forward and repeated-anchor navigation, mobile Escape handling, keyboard tabs, dynamic reduced-motion changes, WebGL unavailable/context-loss fallback, and navigation without JavaScript. Viewport checks covered 320, 390, 768, 1024, 1440 and 1920px with no horizontal overflow.

Axe reported zero WCAG A/AA violations in the tested mobile homepage and desktop case-study states. Desktop, mobile and architecture screenshots were reviewed. The last full-suite mobile observation at 390 × 844 with reduced motion and 4× CPU throttling reported LCP 884ms and CLS 0; this local observation used no network throttling and is not a Lighthouse score or field measurement. Physical devices and deployed-host performance remain unverified.

The generated `out/sitemap.xml` contains the existing public origin and all four project URLs. The static deployment artifact is `out/`. Source changes remain local and uncommitted.

After the final context-remount fix, the production build and targeted Engineering Core regression passed again, including recovery when returning to the hero after a simulated WebGL context loss. The temporary preview server was stopped after verification.

### ScrollTrigger reload regression

Reloading a deep link in development exposed a deferred project-timeline refresh that could remove once-only triggers while the next trigger initialized, throwing `Cannot read properties of undefined (reading 'end')`. Project diagram reveals now use a single staggered tween with immediate trigger initialization, and cards without diagram nodes skip that animation. Image parallax is retained. `npm run test:dev` runs a regression against Next.js development mode; the same regression also runs in the production browser suite. It covers deep-link reloads, responsive reinitialization, reduced-motion changes and visible project reveals.
