"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { layers } from "@/data/portfolio";
import { SceneLoader } from "./scene-loader";
export function Engineering() {
  const [active, setActive] = useState(1);
  const reduce = useReducedMotion();
  return (
    <section className="engineering section-pad" id="systems">
      <div className="section-heading">
        <span className="eyebrow">04 / ENGINEERING IN MOTION</span>
        <span className="eyebrow">ONE SYSTEM. EVERY LAYER.</span>
      </div>
      <div className="engineering-layout">
        <div>
          <h2 data-reveal>
            Everything
            <br />
            is <em>connected.</em>
          </h2>
          <p className="muted measure">
            Good software happens between the layers. Explore how I connect the
            interface to the infrastructure.
          </p>
          <div className="layer-tabs" role="tablist" aria-label="System layers">
            {layers.map((layer, i) => (
              <button
                key={layer.name}
                role="tab"
                id={`layer-${i}`}
                aria-selected={active === i}
                aria-controls="layer-panel"
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (
                    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 5
                          : (active + (e.key === "ArrowRight" ? 1 : 5)) % 6;
                    setActive(next);
                    document.getElementById(`layer-${next}`)?.focus();
                  }
                }}
                tabIndex={active === i ? 0 : -1}
              >
                <span>0{i + 1}</span>
                {layer.name}
                <span>↗</span>
              </button>
            ))}
          </div>
        </div>
        <div className="network-stage">
          <SceneLoader network active={active} onSelect={setActive} />
          <div className="network-labels" aria-hidden="true">
            {layers.map((l, i) => (
              <span className={active === i ? "active" : ""} key={l.name}>
                {l.name}
              </span>
            ))}
          </div>
          <div
            role="tabpanel"
            id="layer-panel"
            aria-labelledby={`layer-${active}`}
            className="layer-detail"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: reduce ? 1 : 0 }}
                transition={{ duration: 0.16 }}
              >
                <span className="eyebrow">
                  {layers[active].name} / IN PRACTICE
                </span>
                <p>{layers[active].text}</p>
                <span className="layer-tools">{layers[active].tools}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
