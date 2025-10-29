import RegisterPage from "@/components/Pages/RegisterPage";
import useAuthStore from "@/store/authStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/register/")({
  beforeLoad: () => {
    const auth = useAuthStore();
    if (auth.user) throw redirect({ to: "/" });
  },
  component: RegisterPage,
});
