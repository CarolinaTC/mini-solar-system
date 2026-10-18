"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { DAYS_PER_SECOND, planets, planetPosition } from "@/data/planets";
import Orbit from "./Orbit";
import Planet, { type LabelElements } from "./Planet";
import Starfield from "./Starfield";
import Sun from "./Sun";

export type ViewRequest = { id: string | null; top: boolean; sequence: number };
type Props = { selected: string; speed: number; paused: boolean; showOrbits: boolean; showLabels: boolean; view: ViewRequest; onSelect: (id: string) => void; onDays: (days: number) => void };

function Scene({ selected, speed, paused, showOrbits, showLabels, view, onSelect, onDays, labels }: Props & { labels: LabelElements }) {
  const days = useRef(0);
  const lastReport = useRef(0);
  const controls = useRef<OrbitControlsType>(null);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const transitioning = useRef(true);
  const focus = planets.find((planet) => planet.id === view.id);
  const priorTarget = useRef(new Vector3());
  const desiredCamera = useRef(new Vector3());
  const target = useRef(new Vector3());

  useEffect(() => { transitioning.current = true; }, [view]);

  useFrame((_, delta) => {
    if (!paused) days.current += Math.min(delta, 0.1) * speed * DAYS_PER_SECOND;
    lastReport.current += delta;
    if (lastReport.current > 0.25) { onDays(days.current); lastReport.current = 0; }
    if (!controls.current) return;
    const currentTarget = target.current;
    if (focus) currentTarget.set(...planetPosition(focus, days.current));
    else currentTarget.set(0, 0, 0);
    if (transitioning.current) {
      const distance = focus ? Math.max(4, focus.radius * 6.5) : 49;
      const aspect = size.width / size.height;
      if (view.top) desiredCamera.current.set(0, distance * (focus ? 1 : 1.32), 0.01);
      else desiredCamera.current.set(distance * 0.23, distance * 0.72, distance * (aspect < 1 ? 1.22 : 0.8));
      desiredCamera.current.add(currentTarget);
      const alpha = 1 - Math.exp(-delta * 3);
      camera.position.lerp(desiredCamera.current, alpha);
      controls.current.target.lerp(currentTarget, alpha);
      if (camera.position.distanceTo(desiredCamera.current) < 0.04) transitioning.current = false;
    } else if (focus) {
      camera.position.add(currentTarget.clone().sub(priorTarget.current));
      controls.current.target.copy(currentTarget);
    }
    priorTarget.current.copy(currentTarget);
    controls.current.update();
  });

  return <>
    <ambientLight intensity={0.7} color="#b6c9e5" />
    <Starfield />
    <Sun />
    {planets.map((planet) => <group key={planet.id}>
      {showOrbits && <Orbit radius={planet.orbitRadius} selected={selected === planet.id} />}
      <Planet planet={planet} days={days} selected={selected === planet.id} showLabels={showLabels} labels={labels} onSelect={onSelect} />
    </group>)}
    <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.08} minDistance={2.7} maxDistance={95} maxPolarAngle={Math.PI * 0.91} onStart={() => { transitioning.current = false; }} />
  </>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Fallback /> : this.props.children; }
}

function Fallback() {
  return <div className="scene-fallback"><span className="fallback-sun" /><h2>This universe needs WebGL</h2><p>Enable hardware acceleration or use a compatible browser. You can still discover the planets in the information panel.</p></div>;
}

export default function SolarSystem(props: Props) {
  const [contextLost, setContextLost] = useState(false);
  const labels = useRef<Record<string, HTMLSpanElement | null>>({});
  if (contextLost) return <Fallback />;
  return <SceneBoundary><div className="canvas-container"><Canvas camera={{ position: [11, 36, 40], fov: 43, near: 0.1, far: 600 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} fallback={<Fallback />} onCreated={({ gl }) => {
    gl.domElement.addEventListener("webglcontextlost", () => setContextLost(true), { once: true });
  }}><Scene {...props} labels={labels} /></Canvas><div className="planet-labels" aria-hidden="true">{planets.map((planet) => <span key={planet.id} ref={(element) => { labels.current[planet.id] = element; }} className={`scene-label ${props.selected === planet.id ? "is-selected" : ""}`} style={{ display: "none" }}>{planet.name}{props.selected === planet.id && <span />}</span>)}</div></div></SceneBoundary>;
}
