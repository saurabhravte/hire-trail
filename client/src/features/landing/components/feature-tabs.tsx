import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TAB_FEATURES } from "../constants";
import { Reveal } from "./reveal";
import {
  BrowserFrame,
  CsvTabPreview,
  OffersTabPreview,
  RemindersTabPreview,
  ResumesTabPreview,
} from "./preview-mockups";

const PREVIEWS: Record<string, React.ReactNode> = {
  resumes: <ResumesTabPreview />,
  offers: <OffersTabPreview />,
  reminders: <RemindersTabPreview />,
  csv: <CsvTabPreview />,
};

export function FeatureTabs() {
  return (
    <section id="more" className="scroll-mt-24 bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            And everything else you need
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            The supporting tools that round out your search.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 max-w-4xl px-6">
        <Reveal>
          <Tabs defaultValue={TAB_FEATURES[0].value} className="gap-8">
            <TabsList className="mx-auto flex-wrap">
              {TAB_FEATURES.map((feature) => (
                <TabsTrigger key={feature.value} value={feature.value}>
                  {feature.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {TAB_FEATURES.map((feature) => (
              <TabsContent key={feature.value} value={feature.value}>
                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                  <div className="space-y-3">
                    <h3 className="font-heading text-2xl font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-pretty">{feature.description}</p>
                  </div>
                  <BrowserFrame>{PREVIEWS[feature.value]}</BrowserFrame>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}