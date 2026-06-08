'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { scrollProgressStore, PROCESS_DESKTOP_QUERY } from '@/lib/scrollProgressStore';

const ACCENT_START = new THREE.Color('#00D4FF'); // cyan (paso 1)
const ACCENT_END = new THREE.Color('#7C3AED'); // violet (paso 5)

function FrameOnScroll() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => scrollProgressStore.subscribe(() => invalidate()), [invalidate]);
  return null;
}

function ProcessObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = useRef(ACCENT_START.clone());

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    const p = scrollProgressStore.get();
    m.rotation.y = p * Math.PI * 2;
    m.rotation.x = p * Math.PI * 0.5;
    m.scale.setScalar(0.9 + p * 1.1);
    color.current.copy(ACCENT_START).lerp(ACCENT_END, p);
    const mat = m.material as THREE.MeshStandardMaterial;
    mat.color.copy(color.current);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1}>
      <icosahedronGeometry args={[1.4, 24]} />
      <MeshDistortMaterial
        color={ACCENT_START.getStyle()}
        distort={0.45}
        speed={1.4}
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function useDesktopMotionGate(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PROCESS_DESKTOP_QUERY);
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return enabled;
}

export default function ProcessBackground3D() {
  const enabled = useDesktopMotionGate();
  return (
    <div className="process-bg-3d" aria-hidden="true">
      {enabled && (
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} color="#00D4FF" />
          <pointLight position={[-5, -3, 2]} intensity={1.2} color="#7C3AED" />
          <Suspense fallback={null}>
            <ProcessObject />
          </Suspense>
          <FrameOnScroll />
        </Canvas>
      )}
    </div>
  );
}
