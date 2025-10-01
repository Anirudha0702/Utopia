import { Outlet, createRootRoute, useMatches } from "@tanstack/react-router";
import Navbar from "@/components/common/Navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const matches = useMatches();

  const isAuthRoute = matches.some(
    (m) => m.routeId === "/login/" || m.routeId === "/register/"
  );

  return (
    <div>
      {!isAuthRoute && <Navbar />}
      <Outlet />
    </div>
  );
}
