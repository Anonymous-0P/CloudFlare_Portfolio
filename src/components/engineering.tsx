"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { layers } from "@/data/portfolio";
import { useSystem } from "./system-state";
gsap.registerPlugin(useGSAP, ScrollTrigger);
const points = [[85,75], [250,75], [415,75], [415,230], [250,230], [85,230]];
export function Engineering() {
  const { active, setActive } = useSystem();
  const root = useRef<HTMLElement>(null);
  const manual = useRef(false);
  const select = (i: number) => { manual.current = true; setActive(i); };
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: root.current, start: "top 45%", end: "bottom 65%",
        onUpdate: (self) => {
          if (!manual.current && !root.current?.contains(document.activeElement)) {
            setActive(Math.min(5, Math.floor(self.progress * 6)));
          }
        },
        onLeave: () => { manual.current = false; },
        onLeaveBack: () => { manual.current = false; },
      });
    });
    return () => media.revert();
  }, { scope: root });
  return (
    <section ref={root} className="engineering section-pad" id="systems">
      <div className="section-heading">
        <span className="eyebrow">04 / ENGINEERING IN MOTION</span>
        <span className="eyebrow">ONE SYSTEM. EVERY LAYER.</span>
      </div>
      <div className="engineering-layout">
        <div>
          <h2 data-reveal>Everything<br />is <em>connected.</em></h2>
          <p className="muted measure">Good software happens between the layers. Explore how I connect the interface to the infrastructure.</p>
          <p className="layer-hint">Scroll through the system, or select a layer.</p>
          <div className="layer-tabs" role="tablist" aria-label="System layers">
            {layers.map((layer, i) => (
              <button key={layer.name} role="tab" id={`layer-${i}`}
                aria-selected={active === i} aria-controls="layer-panel"
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                    e.preventDefault();
                    const next = e.key === "Home" ? 0 : e.key === "End" ? 5 : (i + (e.key === "ArrowRight" ? 1 : 5)) % 6;
                    select(next);
                    document.getElementById(`layer-${next}`)?.focus();
                  }
                }} tabIndex={active === i ? 0 : -1}>
                <span>0{i + 1}</span>{layer.name}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>
        <div className="network-stage">
          <div className="architecture-diagram" aria-hidden="true">
            <span className="eyebrow">REQUEST → RESPONSE / CONCEPTUAL FLOW</span>
            <svg viewBox="0 0 500 310" fill="none">
              {points.slice(0, -1).map(([x,y], i) => <path key={i}
                d={`M${x} ${y} L${points[i+1][0]} ${points[i+1][1]}`}
                className={active === i || active === i + 1 ? "system-path active" : "system-path"} />)}
              <path d="M85 230V75" className={active === 5 ? "system-path active" : "system-path"} strokeDasharray="4 6" />
              <text x="250" y="151" textAnchor="middle" className="diagram-center">THE ENGINEERING CORE</text>
              <text x="250" y="172" textAnchor="middle" className="diagram-subtitle">Connected by design.</text>
              {points.map(([x,y], i) => <g key={i} className={active === i ? "system-node active" : "system-node"} transform={`translate(${x} ${y})`}>
                <rect x="-32" y="-26" width="64" height="52" rx="3" />
                <text textAnchor="middle" y="5">0{i+1}</text>
                <text className="system-node-label" textAnchor="middle" y="48">{layers[i].name}</text>
              </g>)}
            </svg>
          </div>
          <div role="tabpanel" id="layer-panel" tabIndex={0} aria-labelledby={`layer-${active}`} className="layer-detail">
            <div key={active} className="layer-copy">
              <span className="eyebrow">{layers[active].name} / IN PRACTICE</span>
              <p>{layers[active].text}</p>
              <span className="layer-tools">{layers[active].tools}</span>
            </div>
          </div>
        </div>
      </div>
      <noscript><div className="static-layers">{layers.map(layer => <div key={layer.name}><h3>{layer.name}</h3><p>{layer.text}</p><p>{layer.tools}</p></div>)}</div></noscript>
    </section>
  );
}
