import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit — A little universe to explore",
  description: "Explore the solar system in 3D. Discover all eight planets, follow their orbits, and see the universe from a new perspective.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-US"><body>{children}</body></html>;
}
