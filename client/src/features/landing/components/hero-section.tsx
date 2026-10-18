import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "./aurora-background";
import { BrowserFrame, DashboardPreview } from "./preview-mockups";

export function HeroSection() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40">
      <AuroraBackground />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div {...rise(0)}>
          <Badge variant="outline" className="mb-5 bg-background/60 backdrop-blur">
            Job Application Tracker
          </Badge>
        </motion.div>

        <motion.h1
          {...rise(0.08)}
          className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-6xl"
        >
          Run your job search like{" "}
          <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            a pro
          </span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mx-auto mt-5 max-w-xl text-base text-pretty text-muted-foreground md:text-lg"
        >
          Organize every opportunity, track applications and interviews, manage follow-ups and
          resumes, compare offers, and understand what's actually working — all in one calm,
          focused workspace.
        </motion.p>
      </div>

      <motion.div
        {...(reduce
          ? {}
          : {
            initial: { opacity: 0, y: 40 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] },
          })}
        className="mx-auto mt-14 max-w-4xl px-6"
      >
        <BrowserFrame>
          <DashboardPreview />
        </BrowserFrame>
      </motion.div>
    </section>
  );
}
