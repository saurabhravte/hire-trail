import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { JOURNEY } from "../constants";
import { Reveal } from "./reveal";

export function JourneyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  return (
    <section id="how" className="scroll-mt-24 bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            From saved to signed
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Every application carries its full history, so nothing slips through.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="relative mx-auto mt-16 max-w-3xl px-6">
        {/* Track */}
        <div className="absolute inset-y-0 left-[calc(1.5rem+0.5rem)] w-px bg-border md:left-1/2" />
        {/* Progress fill */}
        <motion.div
          className="absolute inset-y-0 left-[calc(1.5rem+0.5rem)] w-px origin-top bg-gradient-to-b from-violet-500 to-emerald-500 md:left-1/2"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
        />

        <div className="space-y-12">
          {JOURNEY.map((step, index) => {
            const onLeft = index % 2 === 0;
            return (
              <div key={step.status} className="relative pl-12 md:pl-0">
                <span
                  className="absolute left-[calc(1.5rem+0.5rem)] top-1.5 z-10 size-3 -translate-x-1/2 rounded-full ring-4 ring-muted/30 md:left-1/2"
                  style={{ backgroundColor: step.color }}
                />
                <div
                  className={cn(
                    "md:w-[calc(50%-2rem)]",
                    onLeft ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8",
                  )}
                >
                  <Reveal>
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: step.color }}
                    >
                      {step.status}
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground text-pretty">
                      {step.description}
                    </p>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}