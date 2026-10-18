import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const BLOBS = [
  { className: "left-[-8%] top-[-12%] bg-blue-500/30", duration: 18 },
  { className: "right-[-8%] top-[8%] bg-cyan-500/25", duration: 22 },
  { className: "left-[22%] bottom-[-24%] bg-teal-500/20", duration: 26 },
];

export function AuroraBackground() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 72%)",
          maskImage: "radial-gradient(ellipse at center, black, transparent 72%)",
        }}
      />
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className={cn("absolute size-[32rem] rounded-full blur-3xl", blob.className)}
          animate={reduce ? undefined : { x: [0, 30, -20, 0], y: [0, -25, 20, 0] }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
