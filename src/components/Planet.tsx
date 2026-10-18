"use client";

import { useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Vector3, type Group, type Mesh } from "three";
import { planetPosition, type PlanetData } from "@/data/planets";

export type LabelElements = RefObject<Record<string, HTMLSpanElement | null>>;
type Props = { planet: PlanetData; days: RefObject<number>; selected: boolean; showLabels: boolean; labels: LabelElements; onSelect: (id: string) => void };

export default function Planet({ planet, days, selected, showLabels, labels, onSelect }: Props) {
  const group = useRef<Group>(null);
  const surface = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const projected = useRef(new Vector3());
  useFrame(({ camera, size }) => {
    const position = planetPosition(planet, days.current);
    group.current?.position.set(...position);
    if (surface.current) surface.current.rotation.y = days.current * 0.13;
    const label = labels.current[planet.id];
    if (label) {
      camera.updateMatrixWorld();
      projected.current.set(position[0], -planet.radius - 0.7, position[2]).project(camera);
      const point = projected.current;
      label.style.display = (showLabels || hovered) && point.z >= -1 && point.z <= 1 ? "flex" : "none";
      label.style.transform = `translate3d(${(point.x + 1) * size.width / 2}px,${(1 - point.y) * size.height / 2}px,0) translate(-50%,-50%)`;
    }
  });
  return <group ref={group} position={planetPosition(planet, 0)}>
    <mesh ref={surface} onClick={(event) => { event.stopPropagation(); onSelect(planet.id); }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
      <sphereGeometry args={[planet.radius, 48, 32]} />
      <meshStandardMaterial color={planet.color} roughness={0.8} metalness={0.03} emissive={planet.color} emissiveIntensity={hovered ? 0.3 : 0.045} />
    </mesh>
    {(selected || hovered) && <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planet.radius * 1.35, planet.radius * 1.4, 64]} />
      <meshBasicMaterial color="#edb273" side={DoubleSide} transparent opacity={0.8} />
    </mesh>}
    {planet.id === "saturn" && <group rotation={[0.38, 0, 0.2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.3, 1.83, 80]} /><meshStandardMaterial color="#baaa8e" side={DoubleSide} transparent opacity={0.68} roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.9, 2.13, 80]} /><meshStandardMaterial color="#d5c4a2" side={DoubleSide} transparent opacity={0.4} roughness={1} /></mesh>
    </group>}
  </group>;
}
