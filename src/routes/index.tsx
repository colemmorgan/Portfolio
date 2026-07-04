/// <reference path="../routeTree.gen.ts" />
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Competencies from "@/components/Competencies";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import SplitFadeUp from "@/components/SplitFadeUp";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <section className="flex min-h-svh items-end p-8">
        <div id="hero-heading" className="w-full">
          <SplitFadeUp
            as="h1"
            className="text-text-dark-heading max-w-[1030px] pt-10 text-[34px] leading-[1.1em] font-medium tracking-[-0.01em] sm:text-[44px] sm:leading-[1.05em] lg:text-[56px] xl:text-[60px]"
            trigger="mount"
            initialDelay={0.7}
          >
            Software Engineer building geospatial tools and ML platforms at
            Satlantis. Graduating from UFlorida spring 2027.
          </SplitFadeUp>
        </div>
      </section>
      <div className="bg-surface-page">
        <Work canAnimate={true} />
        <Experience canAnimate={true} />
        <Competencies canAnimate={true} />
        <PhotoGallery canAnimate={true} />
      </div>
      <Footer />
    </>
  );
}
