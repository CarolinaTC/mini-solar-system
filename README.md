# Orbit · Mini Solar System

An interactive 3D solar system with a minimalist English interface. Explore all eight planets, follow their orbits, and discover planetary data and fascinating facts.

<img width="1364" height="672" alt="image" src="https://github.com/user-attachments/assets/2f71d213-f5b7-4c3b-8050-605aa153731b" />


<img width="1422" height="689" alt="image" src="https://github.com/user-attachments/assets/4dd0a5ea-2ce3-4417-b023-115e90c7deb2" />


## Run locally

Requirements: **Node.js 22 or later** and npm 10.5.1 or later. The Node version is specified in `.nvmrc`.

```bash
# Inside the directory containing package.json
nvm install
nvm use
npm ci
npm run dev
```

If you do not use nvm, install Node.js 22 or later before running the npm commands. Open [localhost:3000](http://localhost:3000). Next.js selects another port if port 3000 is already in use.

```bash
npm run typecheck  # Check TypeScript types
npm run build      # Build the application for production
npm start          # Serve the production build
```

## Features

- Sun with central lighting and a halo, eight planets with simple colors, Saturn's rings, and a starfield.
- Animated orbits with relative speeds calculated from orbital periods.
- Camera rotation, zoom, top view, and perspective reset.
- Selection through the scene or accessible buttons; the camera follows the selected planet.
- Information panel with equatorial diameter, approximate mean temperature, orbital period, distance from the Sun, and facts.
- Pause and speed controls from 0.1× to 10×, with a simulated day counter.
- Options to hide orbits and names, a responsive interface, and built-in help.
- Reduced motion: the simulation starts paused when this device preference is enabled.
- Fallback message when WebGL is unavailable; planetary data remains accessible.

## Controls

| Action | Control |
| --- | --- |
| Rotate | Drag with your mouse or one finger |
| Zoom | Scroll or pinch |
| Pan | Right-click and drag, or use two fingers |
| Select and follow | Click a planet or a button in the list |
| Pause / resume | Playback button or Space |
| Reset camera | Crosshair button or R |
| Return to overview | Escape, outside the help dialog |
| Navigate the interface | Tab and Enter / Space |

## Architecture

| Technology | Role |
| --- | --- |
| Next.js App Router | Application structure, metadata, and builds |
| TypeScript | Data models and component props |
| Three.js and React Three Fiber | Geometry, materials, and the animation loop |
| Drei | OrbitControls and orbit lines |
| Tailwind CSS 4 and CSS | Visual design and responsiveness |
| Lucide | Interface icons |

```text
public/textures/           Reserved for future textures
src/
├── app/
│   ├── page.tsx           Interface state and controls
│   ├── layout.tsx         Language, metadata, and styles
│   └── globals.css        Responsive interface
├── components/
│   ├── SolarSystem.tsx    Canvas, simulation clock, and camera
│   ├── Sun.tsx            Sun, lighting, and GLSL halo
│   ├── Planet.tsx         Planet, orbital position, selection, and rings
│   ├── Orbit.tsx          Circular orbit path
│   ├── Starfield.tsx      Deterministically distributed stars
│   └── PlanetInfo.tsx     Information panel
└── data/
    └── planets.ts         Typed data and position calculations
```

The Canvas is loaded only on the client through a dynamic import. Animation updates refs and Three.js objects in `useFrame`, without triggering a React render every frame. HTML labels live in a stable interface layer, with their positions projected from the 3D scene onto the screen. The interface counter updates four times per second. The animation delta is capped to prevent large jumps after switching browser tabs.

Positions use `angle = initial phase + days / orbital period × 2π`. At 1×, each second represents four Earth days. The camera follows the planet while keeping rotation and zoom controls available. React Three Fiber disposes of geometry and materials on unmount.

## Data and model limitations

Equatorial diameters, mean temperatures, and orbital periods are based on the [NASA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/). Temperatures for gas and ice giants refer to atmospheric reference levels; these planets do not have a solid surface like Earth. AU stands for astronomical unit, approximately the average distance between Earth and the Sun.

This is an educational visualization with circular, coplanar orbits. Sizes and distances are compressed to make all planets visible. Starting positions are illustrative, and the counter begins on page load: the application does not show current astronomical positions. It does not include gravitational simulation or realistic textures. All visuals are generated locally, without requests to external image or font services.

## Deploy to Vercel

1. Add the files to your GitHub repository and push them.
2. Import that repository into Vercel.
3. Select the **Next.js** preset and Node.js **22.x** or later.
4. If you deploy the outer directory, set Root Directory to `mini-solar-system`; if the repository starts directly in this directory, keep the default.
5. Use `npm run build` as the Build Command and deploy. No environment variables are required.

Deployment requires access to your Vercel account and is separate from running locally. For future development, `public/textures/` is reserved for textures with verified licenses and attribution.
