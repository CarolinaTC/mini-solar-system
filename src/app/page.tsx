"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Check, ChevronRight, CircleHelp, Crosshair, Eye, Globe2, Info, Layers3, Mouse, Orbit as OrbitIcon, Pause, Play, RotateCcw, Settings2, X } from "lucide-react";
import PlanetInfo from "@/components/PlanetInfo";
import type { ViewRequest } from "@/components/SolarSystem";
import { formatNumber, planets } from "@/data/planets";

const SolarSystem = dynamic(() => import("@/components/SolarSystem"), { ssr: false, loading: () => <div className="loading-scene"><span className="loading-orbit" /><p>Preparing your universe…</p></div> });

export default function Home() {
  const [selected, setSelected] = useState("earth");
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [days, setDays] = useState(0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState<ViewRequest>({ id: null, top: false, sequence: 0 });
  const dialog = useRef<HTMLDialogElement>(null);
  const settings = useRef<HTMLDivElement>(null);
  const planet = planets.find((item) => item.id === selected)!;
  const resetView = useCallback(() => setView((old) => ({ id: null, top: false, sequence: old.sequence + 1 })), []);
  const selectPlanet = useCallback((id: string) => {
    setSelected(id);
    setView((old) => ({ id, top: false, sequence: old.sequence + 1 }));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setPaused(true);
    const onChange = (event: MediaQueryListEvent) => { if (event.matches) setPaused(true); };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (dialog.current?.open) return;
      if (event.key === "Escape") { resetView(); setSettingsOpen(false); return; }
      if (target?.closest("input, select, textarea, [contenteditable=true]")) return;
      if (event.code === "Space" && !target?.closest("button, a")) { event.preventDefault(); setPaused((value) => !value); }
      if (event.key.toLowerCase() === "r") resetView();
    };
    const onPointer = (event: PointerEvent) => { if (!settings.current?.contains(event.target as Node)) setSettingsOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onPointer); };
  }, [resetView]);

  return <main className="observatory">
    <header className="site-header">
      <a href="#home" className="brand" aria-label="Orbit — home"><span className="brand-symbol"><i /></span>orbit<span className="brand-dot">.</span></a>
      <nav aria-label="Main navigation"><button className="nav-active" onClick={resetView}>Explore the solar system</button><button onClick={() => dialog.current?.showModal()}>About the project<ArrowUpRight size={14} /></button></nav>
      <div className="header-tag"><span />A UNIVERSE OF POSSIBILITIES</div>
    </header>

    <section className="explorer" id="home" aria-labelledby="page-title">
      <div className="scene-area">
        <div className="scene-intro"><p className="eyebrow"><span className="tiny-line" /> CURIOSITY KNOWS NO LIMITS</p><h1 id="page-title">The universe,<br /><em>a little closer.</em></h1><p>Eight planets. One star. Endless discoveries.<br />Pick a destination and let curiosity lead the way.</p></div>
        <div className="scene-canvas" role="region" aria-label="Interactive 3D solar system. Use your mouse to rotate and zoom. Select planets using the buttons below.">
          <SolarSystem selected={selected} speed={speed} paused={paused} showOrbits={showOrbits} showLabels={showLabels} view={view} onSelect={selectPlanet} onDays={setDays} />
        </div>
        <div className="scene-toolbar">
          <div className="view-status"><span className="status-dot" />{view.id ? `EXPLORING ${planet.name.toLocaleUpperCase("en-US")}` : "SOLAR SYSTEM OVERVIEW"}</div>
          <div className="view-actions"><button className={`icon-button ${view.top ? "active" : ""}`} aria-label="Top view" title="Top view" aria-pressed={view.top} onClick={() => setView((old) => ({ id: null, top: !old.top, sequence: old.sequence + 1 }))}><Layers3 size={17} /></button><button className="icon-button" aria-label="Reset camera" title="Reset camera (R)" onClick={resetView}><Crosshair size={17} /></button>
            <div className="settings-wrapper" ref={settings}><button className={`icon-button ${settingsOpen ? "active" : ""}`} aria-label="Display options" title="Display options" aria-expanded={settingsOpen} aria-controls="display-settings" onClick={() => setSettingsOpen(!settingsOpen)}><Settings2 size={17} /></button>
              {settingsOpen && <div id="display-settings" className="settings-popover"><p>Display</p><label><OrbitIcon size={15} />Show orbits<input type="checkbox" checked={showOrbits} onChange={(event) => setShowOrbits(event.target.checked)} /></label><label><Eye size={15} />Planet names<input type="checkbox" checked={showLabels} onChange={(event) => setShowLabels(event.target.checked)} /></label></div>}
            </div>
          </div>
        </div>
        <div className="scene-bottom"><p><Mouse size={15} />Drag to rotate<span />Scroll to zoom</p><span className="scale-label"><Info size={12} />Illustration not to scale</span></div>
        <div className="scene-coordinate" aria-hidden="true"><span>N</span><div>+</div><span>E</span></div>
      </div>
      <PlanetInfo planet={planet} onFocus={() => selectPlanet(selected)} />
    </section>

    <section className="mission-controls" aria-label="Exploration controls">
      <div className="destination-heading"><span className="eyebrow">CHOOSE YOUR DESTINATION</span><span>From the Sun into the unknown<ArrowDown size={13} /></span></div>
      <div className="planet-selector" role="group" aria-label="Select a planet">
        {planets.map((item, index) => <button key={item.id} className={`planet-option ${selected === item.id ? "selected" : ""}`} aria-pressed={selected === item.id} onClick={() => selectPlanet(item.id)} style={{ "--planet-color": item.color } as CSSProperties}>
          <span className="option-number">0{index + 1}</span><span className={`mini-planet ${item.id}`} /><span className="option-copy"><strong>{item.name}</strong><small>{item.distanceAU.toLocaleString("en-US")} AU</small></span>{selected === item.id ? <span className="selection-mark"><Check size={11} /></span> : <ChevronRight size={13} className="option-chevron" />}
        </button>)}
      </div>
      <div className="playback-bar">
        <div className="simulation-status"><span className={paused ? "status-dot paused" : "status-dot"} /><span>SIMULATION {paused ? "PAUSED" : "FAST-FORWARD"}</span><span className="sim-days">D + {formatNumber(Math.floor(days))}</span></div>
        <div className="playback-controls"><button className="play-button" onClick={() => setPaused(!paused)} aria-label={paused ? "Resume orbits" : "Pause orbits"} title={paused ? "Resume (Space)" : "Pause (Space)"}>{paused ? <Play size={15} fill="currentColor" /> : <Pause size={15} fill="currentColor" />}</button><span className="playback-separator" /><label htmlFor="speed">Speed</label><input id="speed" aria-label="Orbital speed" type="range" min="0.1" max="10" step="0.1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /><output htmlFor="speed">{speed.toLocaleString("en-US", { maximumFractionDigits: 1 })}×</output><button className="icon-button speed-reset" aria-label="Reset speed to 1×" title="Reset speed" onClick={() => setSpeed(1)}><RotateCcw size={14} /></button></div>
        <button className="keyboard-help" onClick={() => dialog.current?.showModal()}><CircleHelp size={15} />How to explore</button>
      </div>
    </section>

    <footer className="site-footer"><p>Made for those who never stopped looking up at the stars.</p><span><Globe2 size={12} />SOLAR SYSTEM · MILKY WAY</span><p>An experience in 3D<ArrowUpRight size={12} /></p></footer>

    <dialog ref={dialog} className="about-dialog" aria-label="About Orbit and how to explore" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-content"><button className="dialog-close icon-button" aria-label="Close help" onClick={() => dialog.current?.close()}><X size={20} /></button><span className="eyebrow">WELCOME TO ORBIT</span><h2>A little universe<br />to explore.</h2><p>An educational experience built with Next.js, TypeScript, Three.js, React Three Fiber, Drei, and Tailwind CSS.</p><dl className="help-list"><div><dt>Rotate the view</dt><dd>Drag with your mouse or one finger</dd></div><div><dt>Zoom in and out</dt><dd>Scroll or pinch</dd></div><div><dt>Explore a planet</dt><dd>Click a planet or choose one from the list</dd></div><div><dt>Pause / resume</dt><dd>Space key or playback button</dd></div><div><dt>Reset the camera</dt><dd>R key or crosshair button</dd></div></dl><p className="help-note">At 1×, each second represents 4 Earth days. Relative orbital periods are preserved. Sizes, distances, and starting positions are illustrative; this experience is not an astronomical ephemeris. The simulation starts paused when your device requests reduced motion.</p><a className="source-link" href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noreferrer">Explore the NASA data<ArrowUpRight size={16} /></a></div>
    </dialog>
  </main>;
}
