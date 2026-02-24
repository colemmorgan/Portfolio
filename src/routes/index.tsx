/// <reference path="../routeTree.gen.ts" />
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Competencies from "@/components/Competencies";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <Hero />
      <Work canAnimate />
      <Competencies canAnimate />
      <div className="mt-20"></div>
    </>
  );
}
