"use client";

import React, { useEffect, useState } from "react";

interface Petal {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function SakuraOverlay() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Respect reduced motion preferences
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const count = 9;
    const generatedPetals: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 8,
      left: Math.random() * 94,
      duration: Math.random() * 12 + 14,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.4 + 0.4,
    }));

    setPetals(generatedPetals);
  }, []);

  if (!enabled || petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="sakura-petal"
          style={{
            width: `${p.size}px`,
            height: `${p.size * 1.3}px`,
            left: `${p.left}vw`,
            opacity: p.opacity,
            animation: `sakuraDrift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

