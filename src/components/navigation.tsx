"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
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
        aria-label="Main navigation"
        className={open ? "nav-links open" : "nav-links"}
      >
        <a href="/#work" onClick={() => setOpen(false)}>
          Selected work <span>04</span>
        </a>
        <a href="/#about" onClick={() => setOpen(false)}>
          Approach
        </a>
        <a href="/#experience" onClick={() => setOpen(false)}>
          Experience
        </a>
        <a
          href="/#contact"
          onClick={() => setOpen(false)}
          className="nav-contact"
        >
          Let’s talk <ArrowUpRight size={15} />
        </a>
      </nav>
      <button
        className="menu-toggle"
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
