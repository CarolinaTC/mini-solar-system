"use client";

import { useMemo } from "react";

// Seeded positions stay stable through rerenders and React Strict Mode.
export default function Starfield() {
  const positions = useMemo(() => {
    const data = new Float32Array(2400 * 3);
    let seed = 42;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < data.length; i += 3) {
      const theta = random() * Math.PI * 2;
      const z = random() * 2 - 1;
      const radius = 100 + random() * 120;
      data[i] = radius * Math.sqrt(1 - z * z) * Math.cos(theta);
      data[i + 1] = radius * z;
      data[i + 2] = radius * Math.sqrt(1 - z * z) * Math.sin(theta);
    }
    return data;
  }, []);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#becce0" size={0.17} transparent opacity={0.68} sizeAttenuation depthWrite={false} /></points>;
}
