import {
  Outlet,
  createRootRoute,
  useMatches,
  useRouter,
} from "@tanstack/react-router";
import Navbar from "@/components/common/Navbar";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const matches = useMatches();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const isAuthRoute = matches.some(
    (m) => m.routeId === "/login/" || m.routeId === "/register/"
  );
  useEffect(() => {
    (async () => {
      const refreshRes = await fetch(`/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      if (refreshRes.ok) {
        const { data } = await refreshRes.json();
        console.log("User authenticated:", data);
        setAuth(data);
      } else {
        router.navigate({ to: "/login" });
      }
    })();
  }, []);
  return (
    <div>
      {!isAuthRoute && <Navbar />}
      <Outlet />
    </div>
  );
}
