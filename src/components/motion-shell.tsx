"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);
export function MotionShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({ duration: 1.05, anchors: true });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.from(".hero-line > span", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.13,
        ease: "power4.out",
        clearProps: "transform",
      });
      gsap.from(".hero-reveal", {
        opacity: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.55,
        clearProps: "all",
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          clearProps: "all",
        }),
      );
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline",
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
      gsap.to(".reading-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true },
      });
      const cleanups: (() => void)[] = [];
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document
          .querySelectorAll<HTMLElement>(".round-arrow, .project-external")
          .forEach((el) => {
            const move = (event: PointerEvent) => {
              const box = el.getBoundingClientRect();
              gsap.to(el, {
                x: (event.clientX - box.left - box.width / 2) * 0.18,
                y: (event.clientY - box.top - box.height / 2) * 0.18,
                duration: 0.3,
                overwrite: true,
              });
            };
            const leave = () => {
              gsap.to(el, { x: 0, y: 0, duration: 0.35, overwrite: true });
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
              gsap.set(el, { clearProps: "transform" });
            });
          });
      }
      return () => {
        cleanups.forEach((cleanup) => cleanup());
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, []);
  return <>{children}</>;
}
