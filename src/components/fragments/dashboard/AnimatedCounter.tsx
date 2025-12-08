"use client";
import { useEffect, useState } from "react";

export default function AnimatedCounter({
  value,
  duration = 1200, // ms
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const increment = end / (duration / 16); // 60fps approx
    const step = () => {
      start += increment;
      if (start < end) {
        setDisplay(Math.floor(start));
        requestAnimationFrame(step);
      } else {
        setDisplay(end);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <>Rp.{display.toLocaleString("id-ID")}</>;
}
