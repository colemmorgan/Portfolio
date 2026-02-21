/// <reference path="../routeTree.gen.ts" />
import Hero from "@/components/Hero";
import { SceneCanvas } from "@/components/hero-scene/scene/SceneCanvas";
import Nav from "@/components/Nav";
import Work from "@/components/Work";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Work canAnimate />
    </>
  );
}
