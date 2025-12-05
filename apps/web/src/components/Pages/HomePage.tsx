import useAuthStore from "@/store/authStore";
import CreatePost from "../common/CreatePost";
import Feed from "../common/Feed";

function HomePage() {
  const auth = useAuthStore();
  return (
    <div className="px-4">
      <div className="max-w-3xl mx-auto">
        {auth.user && <CreatePost />}
        <div className="mt-2">
          <Feed userId={auth.user?.id} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
