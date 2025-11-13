import RegisterPage from "@/components/Pages/RegisterPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register/")({
  component: RegisterPage,
});
