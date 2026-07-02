/// <reference path="../routeTree.gen.ts" />
// import Hero from "@/components/Hero";
// import Work from "@/components/Work";
// import Experience from "@/components/Experience";
// import Competencies from "@/components/Competencies";
// import PhotoGallery from "@/components/PhotoGallery";
// import Footer from "@/components/Footer";
import { createFileRoute } from "@tanstack/react-router";
// import { usePageReady } from "@/hooks/usePageReady";

export const Route = createFileRoute("/")({ component: App });

function App() {
  // const pageReady = usePageReady();

  return (
    <div className="fixed inset-0 z-10 flex items-end p-6 pointer-events-none">
      <h1 className="text-white text-[34px] leading-[1.1em] tracking-[-0.01em] font-medium max-w-[1030px] sm:text-[44px] sm:leading-[1.05em] lg:text-[56px] xl:text-[60px]">
        Software Engineer building geospatial tools and ML platforms at Satlantis. Graduating from UFlorida spring 2027.
      </h1>
    </div>
  );
}
