/// <reference path="../routeTree.gen.ts" />
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Competencies from "@/components/Competencies";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import { createFileRoute } from "@tanstack/react-router";
import { usePageReady } from "@/hooks/usePageReady";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const pageReady = usePageReady();

  return (
    <>
      <Hero />
      <div className="bg-surface-page relative z-10">
        <Work canAnimate={pageReady} />
        <Experience canAnimate={pageReady} />
        <Competencies canAnimate={pageReady} />
      </div>
      <PhotoGallery />
      <Footer />
    </>
  );
}
