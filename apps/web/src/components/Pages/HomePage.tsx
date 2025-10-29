import useAuthStore from "@/store/authStore";

function HomePage() {
  const auth = useAuthStore();
  return <div>HomePage {auth.user?.email}</div>;
}

export default HomePage;
