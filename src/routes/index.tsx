/// <reference path="../routeTree.gen.ts" />
import Work from "@/components/Work";
import SplitFadeUp from "@/components/SplitFadeUp";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <section className="min-h-screen flex items-end p-6">
        <SplitFadeUp
          as="h1"
          className="text-white text-[34px] leading-[1.1em] tracking-[-0.01em] font-medium max-w-[1030px] sm:text-[44px] sm:leading-[1.05em] lg:text-[56px] xl:text-[60px]"
          trigger="mount"
          initialDelay={0.7}
        >
          Software Engineer building geospatial tools and ML platforms at Satlantis. Graduating from UFlorida spring 2027.
        </SplitFadeUp>
      </section>
      <div className="bg-surface-page">
        <Work canAnimate={true} />
      </div>
    </>
  );
}
