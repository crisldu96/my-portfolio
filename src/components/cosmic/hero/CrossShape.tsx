'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CrossShapeProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  rotationSpeed?: number;
  bobSpeed?: number;
  bobAmplitude?: number;
}

function createCrossGeometry() {
  const shape = new THREE.Shape();
  const s = 0.3;
  const t = 0.1;

  shape.moveTo(-t, -s);
  shape.lineTo(t, -s);
  shape.lineTo(t, -t);
  shape.lineTo(s, -t);
  shape.lineTo(s, t);
  shape.lineTo(t, t);
  shape.lineTo(t, s);
  shape.lineTo(-t, s);
  shape.lineTo(-t, t);
  shape.lineTo(-s, t);
  shape.lineTo(-s, -t);
  shape.lineTo(-t, -t);
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
}

const crossGeo = createCrossGeometry();

export default function CrossShape({
  position,
  color,
  scale = 1,
  rotationSpeed = 0.3,
  bobSpeed = 1,
  bobAmplitude = 0.15,
}: CrossShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y += rotationSpeed * 0.01;
    meshRef.current.rotation.x += rotationSpeed * 0.005;
    meshRef.current.position.y = initialY + Math.sin(t * bobSpeed) * bobAmplitude;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={crossGeo}
      position={position}
      scale={scale}
    >
      <meshPhongMaterial
        color={color}
        shininess={80}
        specular="#ffffff"
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}
