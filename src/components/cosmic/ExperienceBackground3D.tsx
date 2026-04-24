'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform vec4  uRipples[4]; // x,y,startTime,active
  uniform float uAspect;

  // hash / noise helpers
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  // palette — cosmic violet / cyan / blue
  vec3 palette(float t) {
    vec3 c0 = vec3(0.04, 0.06, 0.14);  // deep space
    vec3 c1 = vec3(0.23, 0.12, 0.56);  // violet
    vec3 c2 = vec3(0.00, 0.83, 1.00);  // cyan
    vec3 c3 = vec3(0.48, 0.23, 0.91);  // magenta-violet
    vec3 col = mix(c0, c1, smoothstep(0.0, 0.35, t));
    col = mix(col, c3, smoothstep(0.35, 0.7, t));
    col = mix(col, c2, smoothstep(0.7, 1.0, t));
    return col;
  }

  void main() {
    // aspect-corrected uv (-1..1)
    vec2 uv = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.0;
    vec2 m  = (uMouse - 0.5) * vec2(uAspect, 1.0) * 2.0;

    // mouse-warped flow field
    vec2 p = uv;
    float t = uTime * 0.08;
    vec2 flow = vec2(
      fbm(p * 1.1 + vec2(t, -t)),
      fbm(p * 1.1 + vec2(-t, t * 0.7))
    );
    p += (flow - 0.5) * 0.9;
    // warp toward mouse
    float md = length(uv - m);
    vec2 pull = (m - uv) * exp(-md * 1.2) * 0.35;
    p += pull;

    float n = fbm(p * 1.4 + uTime * 0.05);

    // radial mouse glow
    float glow = exp(-md * 2.3) * 0.55;

    // click ripples
    float ripple = 0.0;
    for (int i = 0; i < 4; i++) {
      vec4 r = uRipples[i];
      if (r.w < 0.5) continue;
      float age = uTime - r.z;
      if (age < 0.0 || age > 2.4) continue;
      vec2 rp = (r.xy - 0.5) * vec2(uAspect, 1.0) * 2.0;
      float d = length(uv - rp);
      float radius = age * 1.2;
      float ring = exp(-pow((d - radius) * 6.0, 2.0));
      float fade = smoothstep(2.4, 0.0, age);
      ripple += ring * fade * 0.9;
    }

    float v = n + glow + ripple * 0.7;

    // subtle scanline shimmer
    float scan = sin(vUv.y * uResolution.y * 0.9 + uTime * 2.0) * 0.015;

    vec3 col = palette(clamp(v, 0.0, 1.0));
    col += ripple * vec3(0.2, 0.7, 1.0);
    col += glow  * vec3(0.3, 0.5, 1.0);
    col += scan;

    // vignette
    float vig = smoothstep(1.4, 0.2, length(uv));
    col *= mix(0.35, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const ripplesRef = useRef<Float32Array>(new Float32Array(16));
  const ripplesVec4Ref = useRef<THREE.Vector4[]>([
    new THREE.Vector4(),
    new THREE.Vector4(),
    new THREE.Vector4(),
    new THREE.Vector4(),
  ]);
  const nextRippleRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uAspect: { value: size.width / Math.max(size.height, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRipples: { value: ripplesVec4Ref.current },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    }
  }, [size.width, size.height]);

  useEffect(() => {
    const target = typeof window !== 'undefined' ? window : null;
    if (!target) return;

    const host = document.querySelector<HTMLElement>('.experience-bg-3d');
    if (!host) return;

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      targetMouseRef.current.set(Math.min(Math.max(x, 0), 1), Math.min(Math.max(y, 0), 1));
    };

    const onClick = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      const slot = nextRippleRef.current % 4;
      nextRippleRef.current += 1;
      const time = materialRef.current?.uniforms.uTime.value ?? 0;
      ripplesVec4Ref.current[slot].set(x, y, time, 1);
    };

    target.addEventListener('pointermove', onMove, { passive: true });
    target.addEventListener('click', onClick, { passive: true });
    return () => {
      target.removeEventListener('pointermove', onMove);
      target.removeEventListener('click', onClick);
    };
  }, []);

  useFrame((_, dt) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += dt;
    mouseRef.current.lerp(targetMouseRef.current, Math.min(1, dt * 5));
    materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ExperienceBackground3D() {
  return (
    <div className="experience-bg-3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1] }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}
