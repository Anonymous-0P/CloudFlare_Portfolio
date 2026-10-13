"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
export function Navigation() {
  const menu = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      const current = ["about", "work", "experience", "contact"].filter(id => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top < window.innerHeight * 0.4;
      }).pop();
      setActive(current || "");
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    // Observe the rendered sections too: desktop smoothing settles after native scroll events.
    const observer = new IntersectionObserver(fn, { rootMargin: "-30% 0px -60% 0px" });
    ["about", "work", "experience", "contact"].forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => {
      window.removeEventListener("scroll", fn);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menu.current?.focus(); }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className={`navigation ${scrolled ? "is-scrolled" : ""}`}>
      <a href="/" className="brand" aria-label="Prakash Karekar home">
        <span className="monogram">
          pk<span>*</span>
        </span>
        <span className="brand-name">
          PRAKASH
          <br />
          KAREKAR
        </span>
      </a>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={open ? "nav-links open" : "nav-links"}
      >
        <a href="/#work" aria-current={active === "work" ? "location" : undefined} onClick={() => setOpen(false)}>
          Selected work <span>04</span>
        </a>
        <a href="/#about" aria-current={active === "about" ? "location" : undefined} onClick={() => setOpen(false)}>
          Approach
        </a>
        <a href="/#experience" aria-current={active === "experience" ? "location" : undefined} onClick={() => setOpen(false)}>
          Experience
        </a>
        <a
          href="/#contact" aria-current={active === "contact" ? "location" : undefined}
          onClick={() => setOpen(false)}
          className="nav-contact"
        >
          Let’s talk <ArrowUpRight size={15} />
        </a>
      </nav>
      <button
        ref={menu}
        className="menu-toggle"
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>
      <div className="reading-progress" />
    </header>
  );
}
