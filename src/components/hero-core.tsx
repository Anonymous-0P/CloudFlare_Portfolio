"use client";
import { layers } from "@/data/portfolio";
import { SceneLoader } from "./scene-loader";
import { useSystem } from "./system-state";

export function HeroCore() {
  const { active, setActive } = useSystem();
  return <div className="hero-art">
    <div className="art-cross cross-one" aria-hidden="true">+</div>
    <SceneLoader active={active} onSelect={setActive} />
    <div className="core-interface">
      <span className="eyebrow">ASSEMBLY 001 / THE ENGINEERING CORE</span>
      <div className="core-controls" aria-label="Explore engineering layers">
        {layers.map((layer, i) => <button key={layer.name} aria-pressed={active === i} onClick={() => setActive(i)}>{layer.name}</button>)}
      </div>
      <p className="core-description">{layers[active].text}</p>
    </div>
  </div>;
}
