"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";

export default function Orbit({ radius, selected }: { radius: number; selected: boolean }) {
  const points = useMemo(() => Array.from({ length: 161 }, (_, i): [number, number, number] => {
    const angle = (i / 160) * Math.PI * 2;
    return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
  }), [radius]);
  return <Line points={points} color={selected ? "#a18b6b" : "#3c4655"} lineWidth={selected ? 1 : 0.65} transparent opacity={selected ? 0.55 : 0.4} />;
}
