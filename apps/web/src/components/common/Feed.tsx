import { useApi } from "@/hooks/useApi";
import {
  feedResponseSchema,
  type ApiError,
  type UserFeedResponse,
} from "@/types/api";
import { toast } from "sonner";
import Post from "./Post";

interface FeedProps {
  userId?: string;
}
function Feed({ userId }: FeedProps) {
  const feed = useApi<UserFeedResponse, undefined>(
    {
      endpoint: `/post/feed/${userId ?? "public"}`,
      method: "GET",
      responseSchema: feedResponseSchema,
      key: `feed-${userId ?? "public"}`,
    },
    {
      meta: {
        onSuccess: (_data) => {
          toast.success("Posted successfully");
        },
        onError: (error: ApiError) => {
          toast.error(
            error.message || "Failed to create Post. Please try again."
          );
          console.log(error);
        },
      },
    }
  );

  const posts = feed.data?.data ?? [];
  if (feed.isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
}

export default Feed;
