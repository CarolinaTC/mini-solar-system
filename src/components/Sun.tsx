"use client";

import { useMemo } from "react";
import { AdditiveBlending, Color } from "three";

export default function Sun() {
  const uniforms = useMemo(() => ({ color: { value: new Color("#f8af56") } }), []);
  return <group>
    <pointLight intensity={55} decay={1.1} color="#fff0db" />
    <mesh>
      <sphereGeometry args={[2.15, 64, 48]} />
      <meshBasicMaterial color="#ffd795" />
    </mesh>
    <mesh scale={1.07}>
      <sphereGeometry args={[2.15, 48, 32]} />
      <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} uniforms={uniforms}
        vertexShader={`varying vec3 vNormal; varying vec3 vView; void main() { vec4 pos = modelViewMatrix * vec4(position, 1.0); vNormal = normalize(normalMatrix * normal); vView = normalize(-pos.xyz); gl_Position = projectionMatrix * pos; }`}
        fragmentShader={`uniform vec3 color; varying vec3 vNormal; varying vec3 vView; void main() { float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.0); gl_FragColor = vec4(color, rim * 0.5); }`} />
    </mesh>
    {[2.6, 3, 3.6, 4.4].map((radius, index) => <mesh key={radius}>
      <sphereGeometry args={[radius, 32, 24]} />
      <meshBasicMaterial color="#f6a14b" transparent opacity={0.035 / (index + 1)} depthWrite={false} blending={AdditiveBlending} />
    </mesh>)}
  </group>;
}
