"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
const Scene = dynamic(() => import("./sculpture"), { ssr: false });
export function SculptureFallback() {
  return (
    <div className="sculpture-fallback" aria-hidden="true">
      <div className="fallback-ring ring-one" />
      <div className="fallback-ring ring-two" />
      <div className="fallback-core" />
      <div className="fallback-ring ring-three" />
    </div>
  );
}
class SceneBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SculptureFallback /> : this.props.children;
  }
}
export function SceneLoader({
  network = false,
  active = 0,
  onSelect,
}: {
  network?: boolean;
  active?: number;
  onSelect?: (i: number) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 767px)",
    );
    const check = () => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      setReady(!mq.matches && !!gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
    check();
    mq.addEventListener("change", check);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", check);
    };
  }, []);
  return (
    <div
      ref={root}
      className={network ? "network-canvas" : "hero-canvas"}
      aria-hidden="true"
    >
      <SculptureFallback />
      {ready && visible && (
        <SceneBoundary>
          <Scene network={network} active={active} onSelect={onSelect} />
        </SceneBoundary>
      )}
    </div>
  );
}
