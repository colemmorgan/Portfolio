/// <reference path="../routeTree.gen.ts" />
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Work from "@/components/Work";
import SplitFadeUp from "@/components/SplitFadeUp";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Work canAnimate />
      <div className="divide-border-default grid divide-y px-8">
        <div className="grid grid-cols-12 gap-8 border-b py-18">
          <p className="text-text-muted col-span-3 tracking-normal">
            Competencies
          </p>
          <SplitFadeUp
            as="h3"
            className="col-span-6 max-w-[610px] text-4xl font-medium"
            trigger="inView"
          >
            Designer with a background in fullstack dev capable of delivering
            projects from idea to finished product.
          </SplitFadeUp>
          <div className="col-span-3 flex justify-end">
            <img src="/03.svg" alt="" className="h-[100px]" />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-8 border-b py-9">
          <p className="text-text-muted col-span-3 tracking-normal">3.001</p>
          <div className="col-span-6">
            <p className="text-3xl font-medium tracking-[-0.01em]">Design</p>
            <p className="text-text-body mt-9 max-w-[550px] text-lg">
              {" "}
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus
              rerum cum eos sit dolore pariatur omnis quisquam vero distinctio
              debitis tenetur, ratione temporibus alias.
            </p>
          </div>
          <div className="bg-border-default col-span-3 h-[450px]"></div>
        </div>
        <div className="grid grid-cols-12 gap-8 border-b py-9">
          <p className="text-text-muted col-span-3 tracking-normal">3.002</p>
          <div className="col-span-6">
            <p className="text-3xl font-medium tracking-[-0.01em]">Frontend</p>
            <p className="text-text-body mt-9 max-w-[550px] text-lg">
              {" "}
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus
              rerum cum eos sit dolore pariatur omnis quisquam vero distinctio
              debitis tenetur, ratione temporibus alias.
            </p>
          </div>
          <div className="bg-border-default col-span-3 h-[450px]"></div>
        </div>
        <div className="grid grid-cols-12 gap-8 border-b py-9">
          <p className="text-text-muted col-span-3 tracking-normal">3.003</p>
          <div className="col-span-6">
            <p className="text-3xl font-medium tracking-[-0.01em]">Backend</p>
            <p className="text-text-body mt-9 max-w-[550px] text-lg">
              {" "}
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus
              rerum cum eos sit dolore pariatur omnis quisquam vero distinctio
              debitis tenetur, ratione temporibus alias.
            </p>
          </div>
          <div className="bg-border-default col-span-3 h-[450px]"></div>
        </div>
      </div>
    </>
  );
}
