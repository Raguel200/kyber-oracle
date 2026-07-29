"use client";

import { motion } from "framer-motion";
import { createRng } from "../lib/engine";

export function Sigil({ seed, compact = false }: { seed: string; compact?: boolean }) {
  const rng = createRng(`sigil|${seed}`);
  const spokes = 5 + Math.floor(rng() * 5);
  const rotation = Math.floor(rng() * 45);
  const radius = 25 + Math.floor(rng() * 12);
  const inner = 8 + Math.floor(rng() * 9);
  const points = Array.from({ length: spokes }, (_, i) => {
    const angle = (Math.PI * 2 * i) / spokes - Math.PI / 2;
    return `${50 + Math.cos(angle) * radius},${50 + Math.sin(angle) * radius}`;
  }).join(" ");
  const satellites = Array.from({ length: spokes }, (_, i) => {
    const angle = (Math.PI * 2 * i) / spokes - Math.PI / 2;
    const distance = radius + 7;
    return { x: 50 + Math.cos(angle) * distance, y: 50 + Math.sin(angle) * distance, r: 1 + (i % 3) * 0.35 };
  });
  const arcSweep = 38 + Math.floor(rng() * 18);
  const duration = compact ? 0.8 : 1.5;

  return (
    <svg
      viewBox="0 0 100 100"
      className={compact ? "sigil sigil--compact" : "sigil"}
      role="img"
      aria-label="Sigil procédural de la carte"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <motion.circle cx="50" cy="50" r={radius + 11} className="sigil-dim" fill="none" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration }} />
      <motion.polygon points={points} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration, delay: 0.08 }} />
      <motion.circle cx="50" cy="50" r={inner} fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration, delay: 0.15 }} />
      {Array.from({ length: Math.ceil(spokes / 2) }, (_, i) => {
        const angle = (Math.PI * 2 * i) / spokes;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        return <motion.line key={i} x1={50 - (x - 50)} y1={50 - (y - 50)} x2={x} y2={y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: duration * 0.75, delay: 0.2 + i * 0.04 }} />;
      })}
      <motion.path d={`M ${50 - arcSweep / 2} 50 A ${arcSweep / 2} ${arcSweep / 2} 0 0 1 ${50 + arcSweep / 2} 50`} fill="none" className="sigil-accent" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration, delay: 0.3 }} />
      <path d={`M 50 ${50 - inner} L ${50 + inner * 0.88} ${50 + inner * 0.65} L ${50 - inner * 0.88} ${50 + inner * 0.65} Z`} fill="none" className="sigil-accent" />
      {satellites.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={point.r} className={index % 2 ? "sigil-dot" : "sigil-accent-fill"} />)}
    </svg>
  );
}

