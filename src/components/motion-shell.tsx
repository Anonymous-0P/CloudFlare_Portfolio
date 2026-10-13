"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { SystemProvider, useSystem } from "./system-state";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

function MotionContent({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const { progress } = useSystem();
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 1024px) and (pointer: fine)",
    }, (context) => {
      const { motion, desktop } = context.conditions!;
      if (!motion) return;
      const smoother = desktop ? ScrollSmoother.create({
        wrapper: root.current!, content: content.current!, smooth: 0.65,
        smoothTouch: false, effects: false,
      }) : null;
      document.documentElement.classList.toggle("gsap-smooth", !!smoother);
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.from(".hero-line > span", { yPercent: 105, duration: 0.85, stagger: 0.09, clearProps: "transform" })
        .from(".hero-reveal", { opacity: 0, y: 14, duration: 0.65, stagger: 0.08, clearProps: "all" }, 0.3)
        .from(".hero-canvas", { opacity: 0, duration: 0.8, clearProps: "opacity" }, 0.35);
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 24, opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 94%", once: true }, clearProps: "all" });
      });
      gsap.fromTo(".timeline-line", { scaleY: 0 }, { scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 65%", scrub: true } });
      gsap.to(document.querySelector(".reading-progress"), { scaleX: 1, ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true } });
      gsap.to(progress, { current: 1, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } });
      gsap.utils.toArray<HTMLElement>(".project-visual").forEach((el) => {
        const nodes = el.querySelectorAll(".diagram-node");
        // A single tween initializes its trigger immediately. A timeline defers
        // refresh and can remove once-only triggers during another trigger's
        // initialization when React remounts at a restored scroll position.
        if (nodes.length) gsap.from(nodes, {
          opacity: 0, y: 12, stagger: 0.12, duration: 0.65, clearProps: "all",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        const image = el.querySelector("img");
        if (desktop && image) gsap.fromTo(image,
          { yPercent: -2, scale: 1.05 }, { yPercent: 2, scale: 1.05, ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const final = el.dataset.count!;
        const target = Number(final.replace(/[^0-9]/g, ""));
        const suffix = final.replace(/[0-9,]/g, "");
        const value = { n: target };
        gsap.from(value, { n: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 95%", once: true },
          onUpdate: () => { el.textContent = Math.round(value.n).toLocaleString("en-US") + suffix; },
          onComplete: () => { el.textContent = final; },
        });
      });
      gsap.from(".signature-mark", { rotation: -45, opacity: 0.4, duration: 0.8,
        scrollTrigger: { trigger: ".contact", start: "top 85%", once: true }, clearProps: "all" });
      // Native hash navigation can scroll the fixed wrapper rather than the document.
      // Preserve browser-created history entries, then route their position through GSAP.
      let anchorFrame = 0;
      const alignHash = () => {
        if (!smoother) return;
        cancelAnimationFrame(anchorFrame);
        anchorFrame = requestAnimationFrame(() => {
          let id: string;
          try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
          const target = id ? document.getElementById(id) : document.getElementById("main");
          if (!target) return;
          root.current!.scrollTop = 0;
          smoother.scrollTo(target, true, "top 94px");
        });
      };
      const alignAnchor = (event: MouseEvent) => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
        if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute("download")) return;
        const url = new URL(link.href);
        if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search && url.hash) alignHash();
      };
      document.addEventListener("click", alignAnchor);
      window.addEventListener("hashchange", alignHash);
      if (location.hash) alignHash();
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh, { once: true });
      ScrollTrigger.refresh();
      return () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("hashchange", alignHash);
        document.removeEventListener("click", alignAnchor);
        cancelAnimationFrame(anchorFrame);
        smoother?.kill();
        document.documentElement.classList.remove("gsap-smooth");
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => { el.textContent = el.dataset.count!; });
      };
    });
    return () => media.revert();
  }, { scope: root });
  return <div ref={root} id="smooth-wrapper"><div ref={content} id="smooth-content">{children}</div></div>;
}
export function MotionShell({ children }: { children: React.ReactNode }) {
  return <SystemProvider><MotionContent>{children}</MotionContent></SystemProvider>;
}
