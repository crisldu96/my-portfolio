'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CrossShape from './CrossShape';

const crossConfigs = [
  { pos: [-2.5, 1.5, -1] as [number, number, number], color: '#3B82F6', scale: 1.4, rotSpeed: 0.25, bobSpeed: 0.8 },
  { pos: [2.8, -1.2, -2] as [number, number, number], color: '#7C3AED', scale: 1.1, rotSpeed: 0.35, bobSpeed: 1.1 },
  { pos: [0.5, 2.0, -3] as [number, number, number], color: '#F0F4FF', scale: 0.8, rotSpeed: 0.4, bobSpeed: 0.9 },
  { pos: [-1.5, -1.8, -1.5] as [number, number, number], color: '#00D4FF', scale: 1.0, rotSpeed: 0.3, bobSpeed: 1.2 },
  { pos: [3.5, 0.8, -4] as [number, number, number], color: '#3B82F6', scale: 0.7, rotSpeed: 0.45, bobSpeed: 0.7 },
  { pos: [-3.0, -0.5, -3.5] as [number, number, number], color: '#1A1F2E', scale: 1.3, rotSpeed: 0.2, bobSpeed: 1.0 },
  { pos: [1.8, 1.8, -2.5] as [number, number, number], color: '#7C3AED', scale: 0.9, rotSpeed: 0.38, bobSpeed: 0.85 },
  { pos: [-0.8, -2.5, -2] as [number, number, number], color: '#3B82F6', scale: 1.2, rotSpeed: 0.28, bobSpeed: 1.15 },
  { pos: [4.0, -0.3, -1.8] as [number, number, number], color: '#00D4FF', scale: 0.6, rotSpeed: 0.5, bobSpeed: 0.95 },
  { pos: [-2.0, 0.3, -4.5] as [number, number, number], color: '#F0F4FF', scale: 0.75, rotSpeed: 0.33, bobSpeed: 1.05 },
  { pos: [0.0, -0.8, -1] as [number, number, number], color: '#3B82F6', scale: 1.5, rotSpeed: 0.22, bobSpeed: 0.75 },
];

function MouseRotation() {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    current.current.x += (target.current.x - current.current.x) * 0.06;
    current.current.y += (target.current.y - current.current.y) * 0.06;

    groupRef.current.rotation.x = current.current.x;
    groupRef.current.rotation.y = current.current.y + t * 0.08;
    groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.08;
  });

  const handlePointerMove = (e: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    target.current.x = ny * 0.3;
    target.current.y = nx * 0.4;
  };

  useFrame(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handlePointerMove);
    return () => canvas.removeEventListener('pointermove', handlePointerMove);
  });

  return (
    <group ref={groupRef}>
      {crossConfigs.map((cfg, i) => (
        <CrossShape
          key={i}
          position={cfg.pos}
          color={cfg.color}
          scale={cfg.scale}
          rotationSpeed={cfg.rotSpeed}
          bobSpeed={cfg.bobSpeed}
        />
      ))}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-4, 2, 4]} intensity={0.6} color="#3B82F6" distance={15} />
      <pointLight position={[3, -3, 2]} intensity={0.4} color="#7C3AED" distance={12} />
      <pointLight position={[0, 4, -2]} intensity={0.3} color="#00D4FF" distance={10} />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 40% 50%, #0A0F1E 0%, #000000 70%)',
      }}
      gl={{ antialias: true, alpha: false }}
    >
      <Suspense fallback={null}>
        <Lights />
        <MouseRotation />
      </Suspense>
    </Canvas>
  );
}
