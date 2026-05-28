'use client';

import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface CoinProps {
  frontSrc: string;
  reducedMotion: boolean;
}

function createMonogramTexture(size = 512): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const bg = ctx.createRadialGradient(size * 0.32, size * 0.28, 10, size / 2, size / 2, size / 2);
  bg.addColorStop(0, '#2a3f7a');
  bg.addColorStop(1, '#0b1430');
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#3B82F6');
  grad.addColorStop(1, '#7C3AED');
  ctx.fillStyle = grad;
  ctx.font = `900 ${size * 0.55}px 'Space Grotesk', system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CP', size / 2, size / 2 + size * 0.02);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Coin({ frontSrc, reducedMotion }: CoinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const front = useLoader(THREE.TextureLoader, frontSrc);
  const back = useMemo(() => createMonogramTexture(512), []);

  const [spinVel, setSpinVel] = useState(0);
  const dragging = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const idleFloat = useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    idleFloat.current += dt;

    if (!dragging.current) {
      targetRot.current.y += spinVel * dt;
      setSpinVel((v) => v * Math.pow(0.18, dt));
      if (!reducedMotion) {
        targetRot.current.y += 0.25 * dt;
        targetRot.current.x += Math.sin(idleFloat.current * 0.6) * 0.002;
      }
    }

    groupRef.current.rotation.y += (targetRot.current.y - groupRef.current.rotation.y) * Math.min(1, dt * 10);
    groupRef.current.rotation.x += (targetRot.current.x - groupRef.current.rotation.x) * Math.min(1, dt * 10);
    groupRef.current.position.y = reducedMotion ? 0 : Math.sin(idleFloat.current * 1.4) * 0.05;
  });

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !lastPointer.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    targetRot.current.y += dx * 0.01;
    targetRot.current.x += dy * 0.008;
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    dragging.current = false;
    lastPointer.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setSpinVel((v) => v + 14);
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.14, 80]} />
        <meshStandardMaterial color="#0D1530" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.0701]}>
        <circleGeometry args={[0.96, 72]} />
        <meshStandardMaterial map={front} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.0701]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.96, 72]} />
        <meshStandardMaterial map={back} metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.071]}>
        <ringGeometry args={[0.96, 1.0, 80]} />
        <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={0.4} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, -0.071]} rotation={[0, Math.PI, 0]}>
        <ringGeometry args={[0.96, 1.0, 80]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.35} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useWebGLSupported(): boolean {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

export default function HeroCoin({ frontSrc = '/assets/images/header-1.png' }: Partial<{ frontSrc: string }>) {
  const reducedMotion = usePrefersReducedMotion();
  const webglOk = useWebGLSupported();

  if (!webglOk) {
    return (
      <div
        className="hero-coin hero-coin-fallback"
        role="img"
        aria-label="Cristopher Palacios — monogram"
      >
        CP
      </div>
    );
  }

  return (
    <div
      className="hero-coin"
      role="img"
      aria-label={reducedMotion ? 'Cristopher Palacios coin (static)' : 'Cristopher Palacios coin — click or drag to spin'}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 3, 5]} intensity={1.4} color="#F0F4FF" />
        <directionalLight position={[-3, 2, 2]} intensity={0.8} color="#00D4FF" />
        <pointLight position={[0, -2, 3]} intensity={0.6} color="#7C3AED" />
        <directionalLight position={[-2, -1.5, -2]} intensity={0.5} color="#00D4FF" />
        <Suspense fallback={null}>
          <Coin frontSrc={frontSrc} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
