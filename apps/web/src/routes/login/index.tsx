import LoginPage from "@/components/Pages/LoginPage";
import useAuthStore from "@/store/authStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  beforeLoad: () => {
    const auth = useAuthStore.getState();
    console.log(auth);
    if (auth.user) throw redirect({ to: "/" });
  },
  component: LoginPage,
});
