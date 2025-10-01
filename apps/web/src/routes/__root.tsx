import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <hr />
    <img src="/images/logo.webp" alt="Logo" />

    <Outlet />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
