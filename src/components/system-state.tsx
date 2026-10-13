"use client";
import { createContext, useContext, useRef, useState, type MutableRefObject } from "react";

const SystemContext = createContext<{
  active: number;
  setActive: (value: number) => void;
  progress: MutableRefObject<number>;
} | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(1);
  const progress = useRef(0);
  return <SystemContext.Provider value={{ active, setActive, progress }}>{children}</SystemContext.Provider>;
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) throw new Error("Engineering components require SystemProvider");
  return context;
}
