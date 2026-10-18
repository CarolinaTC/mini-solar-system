"use client";

import { ArrowUpRight, MoveUpRight, Sparkles, Thermometer, CircleDashed, Ruler } from "lucide-react";
import { formatNumber, planets, type PlanetData } from "@/data/planets";
import type { CSSProperties } from "react";

export default function PlanetInfo({ planet, onFocus }: { planet: PlanetData; onFocus: () => void }) {
  return <aside className="planet-panel" aria-label={`Information about ${planet.name}`}>
    <div className="panel-heading"><span className="eyebrow">PLANETARY PASSPORT</span><span className="planet-index">0{planets.indexOf(planet) + 1} / 08</span></div>
    <div className="planet-preview" style={{ "--planet-color": planet.color } as CSSProperties} aria-hidden="true">
      <div className="preview-orbit" /><div className={`preview-sphere ${planet.id}`}>{planet.id === "saturn" && <span className="preview-rings" />}</div>
      <span className="preview-cross cross-one">+</span><span className="preview-cross cross-two">+</span>
      <span className="preview-caption">{planet.type}</span>
    </div>
    <div className="planet-copy" key={planet.id}>
      <p className="planet-subtitle">{planet.subtitle}</p>
      <h2 aria-live="polite">{planet.name}<span style={{ background: planet.color }} /></h2>
      <p className="planet-description">{planet.description}</p>
      <dl className="planet-stats">
        <div><dt><Ruler size={14} />Equatorial diameter</dt><dd>{formatNumber(planet.diameter)} <span>km</span></dd></div>
        <div><dt><Thermometer size={14} />Mean temperature</dt><dd>{planet.temperature > 0 ? "+" : ""}{planet.temperature} <span>°C</span></dd></div>
        <div><dt><CircleDashed size={14} />Orbital period</dt><dd>{formatNumber(planet.orbitalDays)} <span>days</span></dd></div>
        <div><dt><MoveUpRight size={14} />Distance from the Sun</dt><dd>{formatNumber(planet.distanceAU)} <span>AU</span></dd></div>
      </dl>
      <div className="planet-fact"><Sparkles size={17} /><div><h3>Did you know…</h3><p>{planet.fact}</p></div></div>
      <button className="focus-button" onClick={onFocus}>Zoom in on {planet.name}<ArrowUpRight size={17} /></button>
      <p className="data-note">Approximate values · <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noreferrer">NASA Fact Sheet ↗</a></p>
    </div>
  </aside>;
}
