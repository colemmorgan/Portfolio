import { lazy, Suspense } from "react";
import { useRouterState } from "@tanstack/react-router";

const SceneCanvas = lazy(() =>
  import("./hero-scene/scene/SceneCanvas").then((m) => ({ default: m.SceneCanvas }))
);

export default function FixedWebGLBackground() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh" aria-hidden="true">
      <Suspense fallback={null}>
        <SceneCanvas />
      </Suspense>
    </div>
  );
}
