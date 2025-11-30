import useAuthStore from "@/store/authStore";
import CreatePost from "../common/CreatePost";

function HomePage() {
  const auth = useAuthStore();
  return (
    <div className="px-4">
      <div className="max-w-4xl mx-auto">{auth.user && <CreatePost />}</div>
    </div>
  );
}

export default HomePage;
