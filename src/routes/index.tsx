/// <reference path="../routeTree.gen.ts" />
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Competencies from "@/components/Competencies";
import Footer from "@/components/Footer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <Hero />
      <div className="bg-surface-page relative z-10">
        <Work canAnimate />
        <Competencies canAnimate />
      </div>
      <Footer />
    </>
  );
}
