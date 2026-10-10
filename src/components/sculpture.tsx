"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Line, AdaptiveDpr } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
function Assembly() {
  const group = useRef<THREE.Group>(null);
  const start = useRef<number | null>(null);
  const segment = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1.72, 0, 0.43, false);
    shape.lineTo(Math.cos(0.43) * 1.28, Math.sin(0.43) * 1.28);
    shape.absarc(0, 0, 1.28, 0.43, 0, true);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.035,
      bevelSegments: 2,
      steps: 1,
      curveSegments: 16,
    });
    geometry.translate(0, 0, -0.21);
    return geometry;
  }, []);
  useEffect(() => () => segment.dispose(), [segment]);
  const particles = useMemo(() => {
    const a = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      const t = i * 2.39996,
        r = 1.55 + (i % 11) / 14;
      a[i * 3] = Math.cos(t) * r;
      a[i * 3 + 1] = Math.sin(t) * r;
      a[i * 3 + 2] = Math.sin(i * 1.7) * 0.65;
    }
    return a;
  }, []);
  useFrame(({ clock, pointer }, delta) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    start.current ??= t;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      -0.48 + pointer.x * 0.18 + Math.sin(t * 0.13) * 0.12,
      3,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      0.5 + pointer.y * 0.1,
      3,
      delta,
    );
    group.current.rotation.z = -0.32 + Math.sin(t * 0.1) * 0.06;
    group.current.scale.setScalar(
      Math.min(1, 0.82 + (t - start.current) * 0.12),
    );
    group.current.children[0].children.forEach((part, i) => {
      const progress = THREE.MathUtils.clamp(
        (t - start.current! - i * 0.045) / 1.1,
        0,
        1,
      );
      part.position.z = Math.pow(1 - progress, 3) * (i % 2 ? 0.9 : -0.9);
    });
  });
  return (
    <group ref={group} rotation={[0.5, -0.48, -0.32]}>
      <group>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]} geometry={segment}>
            <meshStandardMaterial
              color={i % 4 === 0 ? "#ad8567" : "#4d514a"}
              metalness={0.92}
              roughness={0.28}
            />
          </mesh>
        ))}
      </group>
      <mesh rotation={[0.45, 0.6, 0.2]}>
        <torusGeometry args={[1.12, 0.028, 8, 96]} />
        <meshStandardMaterial
          color="#b58a64"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>
      <mesh rotation={[0.5, 0.2, 0.4]}>
        <icosahedronGeometry args={[0.84, 1]} />
        <meshStandardMaterial
          color="#777d70"
          wireframe
          metalness={0.65}
          roughness={0.4}
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color="#c4a185"
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>
      <mesh rotation={[0.2, 1.15, 0.2]}>
        <torusGeometry args={[1.98, 0.012, 8, 128]} />
        <meshStandardMaterial color="#8b9180" metalness={0.8} roughness={0.4} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#a88c71"
          size={0.018}
          transparent
          opacity={0.65}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
const positions: [number, number, number][] = [
  [-1.8, 1.2, 0],
  [0, 1.2, 0.5],
  [1.8, 1.2, 0],
  [-1.8, -1.2, 0],
  [0, -1.2, 0.5],
  [1.8, -1.2, 0],
];
function Network({
  active,
  onSelect,
}: {
  active: number;
  onSelect?: (i: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(-1);
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        ((active % 3) - 1) * -0.13,
        3,
        delta,
      );
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        active < 3 ? -0.15 : 0.15,
        3,
        delta,
      );
    }
  });
  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh
            onPointerOver={() => setHover(i)}
            onPointerOut={() => setHover(-1)}
            onClick={() => onSelect?.(i)}
            rotation={[Math.PI / 4, Math.PI / 4, 0]}
            scale={active === i ? 1.25 : 1}
          >
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial
              color={active === i || hover === i ? "#b58a64" : "#63685b"}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
      {positions.slice(1).map((p, i) => (
        <Line
          key={i}
          points={[positions[i], p]}
          color={active === i || active === i + 1 ? "#b58a64" : "#41473f"}
          lineWidth={1}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <Line
          key={i}
          points={[positions[i], positions[i + 3]]}
          color={active === i || active === i + 3 ? "#b58a64" : "#41473f"}
        />
      ))}
    </group>
  );
}
export default function Sculpture({
  network = false,
  active = 0,
  onSelect,
}: {
  network?: boolean;
  active?: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, network ? 7 : 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () => {
          gl.domElement.style.display = "none";
          gl.domElement
            .closest(".hero-canvas,.network-canvas")
            ?.classList.add("webgl-lost");
        });
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={3} />
      <directionalLight position={[-4, -2, 3]} color="#d3bba2" intensity={2} />
      <Environment resolution={128}>
        <Lightformer position={[0, 4, 3]} scale={[8, 3, 1]} intensity={4} />
        <Lightformer position={[-4, 0, 2]} scale={[2, 7, 1]} intensity={3} />
      </Environment>
      {network ? <Network active={active} onSelect={onSelect} /> : <Assembly />}
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
