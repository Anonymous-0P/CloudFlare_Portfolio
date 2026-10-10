"use client";
import { useState } from "react";
const signals = [
  { label: "Repeated pattern", bits: 18, level: "LOW", bars: 2 },
  { label: "Mixed character set", bits: 52, level: "MODERATE", bars: 5 },
  { label: "Long random sequence", bits: 96, level: "HIGH", bars: 9 },
];
export function SecuritySignal() {
  const [active, setActive] = useState(1);
  return (
    <div className="signal-panel">
      <div className="visual-top">
        <span>CREDENTIAL ANALYSIS</span>
        <span>SYNTHETIC DEMO</span>
      </div>
      <div className="signal-value">
        <span>
          {signals[active].bits}
          <small> bits</small>
        </span>
        <span className="eyebrow">ILLUSTRATIVE ENTROPY</span>
      </div>
      <div className="signal-bars" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <i
            key={i}
            className={i < signals[active].bars ? "lit" : ""}
            style={{ height: `${32 + i * 6}px` }}
          />
        ))}
      </div>
      <div
        className="signal-controls"
        aria-label="Synthetic credential patterns"
      >
        {signals.map((s, i) => (
          <button
            key={s.label}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p aria-live="polite">
        {signals[active].level} estimated complexity{" "}
        <span> / illustrative values, not a password assessment</span>
      </p>
    </div>
  );
}
