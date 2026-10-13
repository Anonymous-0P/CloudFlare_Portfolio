"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Line, RoundedBox } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSystem } from "./system-state";

const nodes: [number, number, number][] = [
  [-1.9, 1.45, 0], [0, 1.95, 0], [1.9, 1.45, 0],
  [1.9, -1.45, 0], [0, -1.95, 0], [-1.9, -1.45, 0],
];

// All 48 processor pins share one geometry, material, and draw call.
function Contacts() {
  const pins = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    if (!pins.current) return;
    const dummy = new THREE.Object3D();
    for (let side = 0; side < 4; side++) {
      for (let pin = 0; pin < 12; pin++) {
        const along = (pin - 5.5) * 0.13;
        dummy.position.set(side < 2 ? along : (side === 2 ? -1 : 1), side < 2 ? (side === 0 ? -1 : 1) : along, 0.04);
        dummy.rotation.z = side < 2 ? 0 : Math.PI / 2;
        dummy.updateMatrix();
        pins.current.setMatrixAt(side * 12 + pin, dummy.matrix);
      }
    }
    pins.current.instanceMatrix.needsUpdate = true;
  }, []);
  return <instancedMesh ref={pins} args={[undefined, undefined, 48]}>
    <boxGeometry args={[0.055, 0.28, 0.055]} />
    <meshStandardMaterial color="#b58a64" metalness={0.8} roughness={0.32} />
  </instancedMesh>;
}

function Assembly({ active, onSelect }: { active: number; onSelect?: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const satellites = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const { progress } = useSystem();
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current || !lid.current) return;
    start.current ??= clock.elapsedTime;
    const elapsed = clock.elapsedTime - start.current;
    const settle = 1 - Math.pow(1 - Math.min(1, elapsed / 1.1), 3);
    group.current.scale.setScalar(0.94 + settle * 0.06);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.38 + pointer.y * 0.09 + progress.current * 0.2, 4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.38 + pointer.x * 0.13 + progress.current * 0.4, 4, delta);
    group.current.rotation.z = -0.15 + Math.sin(clock.elapsedTime * 0.2) * 0.025;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.035 - progress.current * 0.18;
    lid.current.position.z = 0.22 + (1 - settle) * 0.7 + progress.current * 0.4;
    satellites.current?.children.forEach((node, i) => {
      const activation = Math.min(1, Math.max(0, (elapsed - i * 0.07) / 0.7));
      node.scale.setScalar(0.8 + activation * 0.2);
      node.position.z = (1 - activation) * 0.5 + (active === i ? 0.12 : 0);
    });
  });
  return <group ref={group} rotation={[0.38, -0.38, -0.15]}>
    <RoundedBox args={[1.86, 1.86, 0.15]} radius={0.06} smoothness={2}>
      <meshStandardMaterial color="#333d32" metalness={0.6} roughness={0.4} />
    </RoundedBox>
    <Contacts />
    <group ref={lid} position={[0, 0, 0.22]}>
      <RoundedBox args={[1.44, 1.44, 0.18]} radius={0.065} smoothness={3}>
        <meshStandardMaterial color="#9a9c90" metalness={0.92} roughness={0.32} />
      </RoundedBox>
      <RoundedBox args={[0.84, 0.84, 0.045]} position={[0, 0, 0.11]} radius={0.025} smoothness={2}>
        <meshStandardMaterial color="#323b31" metalness={0.7} roughness={0.28} />
      </RoundedBox>
      {[-0.24, 0, 0.24].map((x) => <Line key={x} points={[[x, -0.29, 0.14], [x, 0.29, 0.14]]} color="#b58a64" lineWidth={1} />)}
      {[-0.58, 0.58].flatMap((x) => [-0.58, 0.58].map((y) => <mesh key={x + ":" + y} position={[x, y, 0.105]}>
        <boxGeometry args={[0.045, 0.045, 0.018]} />
        <meshStandardMaterial color="#444b40" metalness={0.8} roughness={0.4} />
      </mesh>))}
    </group>
    {nodes.map((p, i) => <Line key={i} points={[[p[0] * 0.46, p[1] * 0.46, 0], [p[0] * 0.72, p[1] * 0.46, 0], p]} color={active === i ? "#c6966b" : "#7a8271"} lineWidth={active === i ? 1.8 : 0.8} />)}
    <group ref={satellites}>
      {nodes.map((p, i) => <group key={i} position={p}>
        <RoundedBox args={[0.46, 0.36, 0.12]} radius={0.035} smoothness={2}
          onClick={(event) => { event.stopPropagation(); onSelect?.(i); }}>
          <meshStandardMaterial color={active === i ? "#b58a64" : "#535e4e"} metalness={0.75} roughness={0.34} emissive="#b58a64" emissiveIntensity={active === i ? 0.18 : 0} />
        </RoundedBox>
        <mesh position={[0, 0, 0.071]}><boxGeometry args={[0.22, 0.025, 0.015]} /><meshBasicMaterial color={active === i ? "#f0c399" : "#a9b29d"} /></mesh>
      </group>)}
    </group>
  </group>;
}

function ContextLifecycle() {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.closest(".hero-canvas")?.classList.remove("webgl-lost");
    const lost = (event: Event) => {
      event.preventDefault();
      canvas.style.visibility = "hidden";
      canvas.closest(".hero-canvas")?.classList.add("webgl-lost");
    };
    const restored = () => {
      canvas.style.visibility = "visible";
      canvas.closest(".hero-canvas")?.classList.remove("webgl-lost");
    };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [gl]);
  return null;
}

export default function Sculpture({ active = 1, onSelect }: { active?: number; onSelect?: (i: number) => void }) {
  return <Canvas dpr={[1, 1.35]} camera={{ position: [0, 0, 7.8], fov: 40 }} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
    <ambientLight intensity={0.8} />
    <directionalLight position={[3, 5, 5]} intensity={2.5} />
    <Environment resolution={64} frames={1}>
      <Lightformer position={[0, 4, 4]} scale={[8, 3, 1]} intensity={3} />
      <Lightformer position={[-4, 0, 3]} scale={[2, 7, 1]} intensity={2} />
    </Environment>
    <Assembly active={active} onSelect={onSelect} />
    <ContextLifecycle />
  </Canvas>;
}
