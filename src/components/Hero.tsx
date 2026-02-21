import SplitFadeUp from "./SplitFadeUp";
import { SceneCanvas } from "./hero-scene/scene/SceneCanvas";

export default function Hero() {
  return (
    <section className="border-border-default mt-14 border-b">
      <div className="mx-auto flex h-[620px] flex-col justify-between px-8 pt-3 pb-6 font-medium">
        <SceneCanvas />
        <div className="flex items-end justify-between">
          <SplitFadeUp
            as="h1"
            className="max-w-[940px] text-[56px] leading-[1.05em] tracking-[-0.01em]"
            trigger="inView"
          >
            Design Engineer building geospatial tools and ML Ops platforms at
            Satlantis. Graduating from UFlorida spring 27’.
          </SplitFadeUp>
          <img src="/01.svg" alt="" className="h-[176px]" />
        </div>
      </div>
    </section>
  );
}
