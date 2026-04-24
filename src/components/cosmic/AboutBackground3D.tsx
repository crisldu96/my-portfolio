'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const count = 1800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.05;
    ref.current.rotation.x += dt * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#00D4FF"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  );
}

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.22;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1.8}>
      <icosahedronGeometry args={[1, 24]} />
      <MeshDistortMaterial
        color="#3B82F6"
        distort={0.5}
        speed={1.6}
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

function MouseParallax() {
  useFrame((state) => {
    const { pointer, camera } = state;
    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function AboutBackground3D() {
  return (
    <div className="about-bg-3d" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#00D4FF" />
        <pointLight position={[-5, -3, 2]} intensity={1.2} color="#7C3AED" />
        <Suspense fallback={null}>
          <Stars />
          <Blob />
        </Suspense>
        <MouseParallax />
      </Canvas>
    </div>
  );
}
