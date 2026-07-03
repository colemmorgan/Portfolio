import { useRouterState } from "@tanstack/react-router";
import { SceneCanvas } from "./hero-scene/scene/SceneCanvas";

export default function FixedWebGLBackground() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/") {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <SceneCanvas />
    </div>
  );
}
