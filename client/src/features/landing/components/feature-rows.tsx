import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FEATURE_ROWS } from "../constants";
import { Reveal } from "./reveal";
import { BrowserFrame, previewFor } from "./preview-mockups";

export function FeatureRows() {
  return (
    <section id="features" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Built around how a real job search works
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Not a generic to-do list — purpose-built tools for each stage.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 max-w-5xl space-y-20 px-6 md:space-y-28">
        {FEATURE_ROWS.map((row, index) => {
          const reversed = index % 2 === 1;
          return (
            <div
              key={row.eyebrow}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <Reveal className={cn(reversed && "md:order-2")}>
                <p className={cn("text-sm font-semibold", row.accent)}>{row.eyebrow}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                  {row.title}
                </h3>
                <p className="mt-3 text-muted-foreground text-pretty">{row.description}</p>
                <ul className="mt-5 space-y-2.5">
                  {row.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.1} className={cn(reversed && "md:order-1")}>
                <BrowserFrame>{previewFor(row.preview)}</BrowserFrame>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}