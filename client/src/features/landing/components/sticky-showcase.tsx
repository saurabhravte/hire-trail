import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import {
  AnalyticsBreakdownPreview,
  AnalyticsResponsePreview,
  AnalyticsTrendPreview,
  BrowserFrame,
} from "./preview-mockups";

const ITEMS = [
  {
    title: "Rates that actually mean something",
    description:
      "Response, interview, offer, and acceptance rates — all computed with saved jobs excluded and sample sizes shown, so you're never misled by small numbers.",
    render: () => <AnalyticsResponsePreview />,
  },
  {
    title: "See your momentum over time",
    description:
      "An activity graph by day, week, or month reveals whether you're keeping pace, with a date range you control.",
    render: () => <AnalyticsTrendPreview />,
  },
  {
    title: "Know what's working",
    description:
      "Break performance down by platform, resume version, role, and tech stack to double down on what gets replies.",
    render: () => <AnalyticsBreakdownPreview />,
  },
];

export function StickyShowcase() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section id="analytics" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-semibold text-violet-500">Analytics</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Turn your search into insight
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-10 px-6 md:grid-cols-2 md:gap-14">
        {/* Scrolling text column (visuals inline on mobile) */}
        <div className="space-y-16 md:space-y-28">
          {ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              onViewportEnter={() => setActive(index)}
              viewport={{ margin: "-45% 0px -45% 0px" }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  0{index + 1}
                </span>
                <h3 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-pretty">{item.description}</p>
              </div>
              <div className="md:hidden">
                <BrowserFrame>{item.render()}</BrowserFrame>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sticky visual column (desktop) */}
        <div className="hidden md:block">
          <div className="sticky top-28">
            <BrowserFrame>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {ITEMS[active].render()}
                </motion.div>
              </AnimatePresence>
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  );
}