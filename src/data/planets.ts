export type PlanetData = {
  id: string;
  name: string;
  subtitle: string;
  type: string;
  color: string;
  diameter: number;
  temperature: number;
  orbitalDays: number;
  distanceAU: number;
  radius: number;
  orbitRadius: number;
  phase: number;
  description: string;
  fact: string;
};

// Equatorial diameters and approximate mean temperatures: NASA Planetary Fact Sheet.
// Scene radii and orbital distances are deliberately compressed for legibility.
export const planets: PlanetData[] = [
  { id: "mercury", name: "Mercury", subtitle: "Closest to the Sun", type: "Rocky planet", color: "#b9b2a9", diameter: 4879, temperature: 167, orbitalDays: 88, distanceAU: 0.39, radius: 0.29, orbitRadius: 4.3, phase: 2.5, description: "Small, rocky, and covered in craters. Mercury travels around the Sun faster than any other planet.", fact: "A solar day on Mercury lasts about 176 Earth days: twice as long as its year!" },
  { id: "venus", name: "Venus", subtitle: "Our hottest neighbor", type: "Rocky planet", color: "#e3b778", diameter: 12104, temperature: 464, orbitalDays: 224.7, distanceAU: 0.72, radius: 0.47, orbitRadius: 6.2, phase: 4.1, description: "Wrapped in a dense atmosphere, Venus traps heat through an intense greenhouse effect. It is the hottest planet in the solar system.", fact: "Venus spins so slowly that a single rotation takes longer than a trip around the Sun." },
  { id: "earth", name: "Earth", subtitle: "Our little blue dot", type: "Rocky planet", color: "#70a9ce", diameter: 12756, temperature: 15, orbitalDays: 365.2, distanceAU: 1, radius: 0.53, orbitRadius: 8.2, phase: 0.72, description: "Blue oceans, continents, and a protective atmosphere. Earth is the only world where we know life exists.", fact: "Sunlight takes about 8 minutes and 20 seconds to reach Earth. The sunlight we see is a glimpse of the past." },
  { id: "mars", name: "Mars", subtitle: "The red planet", type: "Rocky planet", color: "#d27d5e", diameter: 6792, temperature: -65, orbitalDays: 687, distanceAU: 1.52, radius: 0.39, orbitRadius: 10.3, phase: 3.35, description: "A world of red deserts, polar ice caps, and traces of ancient rivers. Mars is a major destination for space exploration.", fact: "Olympus Mons on Mars is a volcano standing about 22 kilometers tall." },
  { id: "jupiter", name: "Jupiter", subtitle: "The giant of the solar system", type: "Gas giant", color: "#d5b393", diameter: 142984, temperature: -110, orbitalDays: 4331, distanceAU: 5.2, radius: 1.2, orbitRadius: 14, phase: 5.78, description: "A giant of hydrogen and helium, with bands of clouds and enormous storms. Jupiter has more mass than all the other planets combined.", fact: "The Great Red Spot is a gigantic storm that has been observed for hundreds of years." },
  { id: "saturn", name: "Saturn", subtitle: "The lord of the rings", type: "Gas giant", color: "#dec89e", diameter: 120536, temperature: -140, orbitalDays: 10747, distanceAU: 9.58, radius: 0.98, orbitRadius: 18.1, phase: 2.4, description: "Its rings of ice and rock make Saturn one of the most recognizable worlds. Despite its size, it has a very low density.", fact: "Saturn has a lower average density than water. In a large enough ocean, it would float." },
  { id: "uranus", name: "Uranus", subtitle: "A world on its side", type: "Ice giant", color: "#9bd4d3", diameter: 51118, temperature: -195, orbitalDays: 30589, distanceAU: 19.2, radius: 0.72, orbitRadius: 21.5, phase: 4.15, description: "Methane in its atmosphere gives Uranus a blue-green hue. It orbits the Sun with its rotation axis tilted almost onto its side.", fact: "Its extreme tilt means each pole can spend about 42 Earth years in darkness." },
  { id: "neptune", name: "Neptune", subtitle: "Beyond the blue horizon", type: "Ice giant", color: "#6385d4", diameter: 49528, temperature: -200, orbitalDays: 59800, distanceAU: 30.1, radius: 0.7, orbitRadius: 24.8, phase: 0.5, description: "Cold, distant, and swept by fierce winds. Neptune is the farthest planet from the Sun and takes almost 165 years to complete an orbit.", fact: "Neptune was discovered in 1846 with the help of mathematical predictions, before it was identified through a telescope." },
];

export const DAYS_PER_SECOND = 4;
export const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

export function planetPosition(planet: PlanetData, days: number): [number, number, number] {
  const angle = planet.phase + (days / planet.orbitalDays) * Math.PI * 2;
  return [Math.cos(angle) * planet.orbitRadius, 0, Math.sin(angle) * planet.orbitRadius];
}
