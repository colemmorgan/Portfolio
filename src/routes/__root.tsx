import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import Nav from "@/components/Nav";
import FixedWebGLBackground from "@/components/BackgroundScene";
import Preloader from "@/components/preloader";
import "../styles.css";

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative">
      {pathname === "/" && <Preloader />}
      <FixedWebGLBackground />
      <Nav />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Cole Morgan | Software Engineer",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/icons/circle.svg",
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ backgroundColor: "#00bbfd" }}>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
