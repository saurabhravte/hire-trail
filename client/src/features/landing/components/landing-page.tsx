import { LandingNavbar } from "./landing-navbar";
import { HeroSection } from "./hero-section";
import { FeatureRows } from "./feature-rows";
import { JourneyTimeline } from "./journey-timeline";
import { StickyShowcase } from "./sticky-showcase";
import { FeatureTabs } from "./feature-tabs";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeatureRows />
        <JourneyTimeline />
        <StickyShowcase />
        <FeatureTabs />
      </main>
      <LandingFooter />
    </div>
  );
}