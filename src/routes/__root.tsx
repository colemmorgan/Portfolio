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
      {
        name: "description",
        content:
          "Cole Morgan is a Software Engineer building geospatial tools and ML platforms. Explore his work, experience, and technical projects.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "https://colemorgan.me/",
      },
      {
        property: "og:title",
        content: "Cole Morgan | Software Engineer",
      },
      {
        property: "og:description",
        content:
          "Cole Morgan is a Software Engineer building geospatial tools and ML platforms. Explore his work, experience, and technical projects.",
      },
      {
        property: "og:image",
        content: "https://colemorgan.me/project-mockups/wizlite.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Cole Morgan | Software Engineer",
      },
      {
        name: "twitter:description",
        content:
          "Cole Morgan is a Software Engineer building geospatial tools and ML platforms. Explore his work, experience, and technical projects.",
      },
      {
        name: "twitter:image",
        content: "https://colemorgan.me/project-mockups/wizlite.png",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/icons/circle.svg",
      },
      {
        rel: "canonical",
        href: "https://colemorgan.me/",
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
