"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
const Scene = dynamic(() => import("./sculpture"), { ssr: false });
export function SculptureFallback() {
  return <div className="sculpture-fallback" aria-hidden="true">
    <svg viewBox="0 0 440 360" fill="none">
      <g stroke="#7a8271" strokeWidth="1.5">
        <path d="M115 75H160V135M220 50V120M325 75H280V135M325 285H280V225M220 310V240M115 285H160V225" />
        {[[90,55],[200,25],[310,55],[310,265],[200,295],[90,265]].map(([x,y], i) => <rect key={i} x={x} y={y} width="40" height="30" rx="4" fill="#535e4e" />)}
      </g>
      <g transform="translate(220 180) rotate(-12)">
        <rect x="-83" y="-78" width="166" height="166" rx="8" fill="#333d32" stroke="#b58a64" />
        {Array.from({length: 10}, (_,i) => <path key={i} d={`M${-59+i*13} -92v14 M${-59+i*13} 88v14 M-97 ${-55+i*13}h14 M83 ${-55+i*13}h14`} stroke="#b58a64" strokeWidth="4" />)}
        <rect x="-65" y="-65" width="130" height="130" rx="6" fill="#a3a69a" stroke="#d2d2c8" />
        <rect x="-38" y="-38" width="76" height="76" rx="3" fill="#333d32" />
        <path d="M-18 -25v50 M0 -25v50 M18 -25v50" stroke="#b58a64" />
      </g>
    </svg>
  </div>;
}
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SculptureFallback /> : this.props.children; }
}
export function SceneLoader({ active = 1, onSelect }: { active?: number; onSelect?: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)");
    const check = () => {
      if (mq.matches || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
        setReady(false); return;
      }
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        setReady(!!gl);
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch { setReady(false); }
    };
    const visibility = () => setForeground(!document.hidden);
    check();
    visibility();
    mq.addEventListener("change", check);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", check);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return <div ref={root} className="hero-canvas" aria-hidden="true">
    <SculptureFallback />
    {ready && visible && foreground && <SceneBoundary><Scene active={active} onSelect={onSelect} /></SceneBoundary>}
  </div>;
}
