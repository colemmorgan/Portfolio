/// <reference path="../routeTree.gen.ts" />
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Competencies from "@/components/Competencies";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import SplitFadeUp from "@/components/SplitFadeUp";
import NotchBox from "@/components/NotchBox";
import { useFontsReady } from "@/hooks/useFontsReady";
import { usePageReady } from "@/hooks/usePageReady";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  // The frame traces the heading's box, so hold it until the real face has
  // laid out (fallback metrics reflow) and the preloader has lifted.
  const fontsReady = useFontsReady();
  const pageReady = usePageReady();

  return (
    <>
      <section
        data-hero
        className="relative flex min-h-svh items-end px-6 pt-8 pb-6 sm:px-8"
      >
        <p
          className={`text-text-dark-muted absolute right-8 bottom-6 hidden font-[Geist_Mono] text-[10px] tracking-wide uppercase transition-opacity duration-700 lg:block ${pageReady ? "opacity-70" : "opacity-0"}`}
        >
          LiDAR:{" "}
          <a
            href="https://registry.opendata.aws/usgs-lidar/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-dark-heading underline-offset-2 transition-colors hover:underline"
          >
            USGS 3DEP
          </a>{" "}
          · Lower Manhattan, NY
        </p>
        <div id="hero-heading" className="w-full pt-10">
          <NotchBox
            active={fontsReady && pageReady}
            // A definite width, not w-fit: SplitFadeUp re-splits lines when its
            // box resizes, and a shrink-to-fit frame would narrow on every split.
            className="w-full max-w-[960px] px-4 py-4 sm:px-7 sm:py-5"
          >
            <SplitFadeUp
              as="h1"
              className="text-text-dark-heading font-serif max-w-[1030px] text-pretty text-[34px] leading-[1.1em] font-normal tracking-[-0.01em] sm:text-[44px] sm:leading-[1.22] lg:text-[50px]"
              trigger="mount"
              initialDelay={0.7}
            >
              Software Engineer building geospatial tools and ML platforms at
              Satlantis. Graduating from UFlorida spring 2027.
            </SplitFadeUp>
          </NotchBox>
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
