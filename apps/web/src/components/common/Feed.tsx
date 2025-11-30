import { useApi } from "@/hooks/useApi";
import {
  feedResponseSchema,
  type ApiError,
  type UserFeedResponse,
} from "@/types/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Lock, UsersRound, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FeedProps {
  userId?: string;
  profilePic: string | null;
}
function Feed({ userId, profilePic }: FeedProps) {
  const feed = useApi<UserFeedResponse, undefined>(
    {
      endpoint: `/post/feed/${userId ?? "public"}`,
      method: "GET",
      responseSchema: feedResponseSchema,
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
  const privacyIcons = {
    public: <Globe size={14} />,
    private: <Lock size={14} />,
    follower_only: <UsersRound size={14} />,
  };
  const posts = feed.data?.data ?? [];
  if (feed.isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <Card className="w-full border rounded-xl shadow-sm" key={post.id}>
          <CardContent className="p-4 space-y-3">
            {/* USER HEADER */}
            <div className="flex items-center gap-3">
              <img
                src={
                  post.user.profilePicture ??
                  "https://res.cloudinary.com/dmz0cwtzd/image/upload/v1715690920/xeqy2nknjul9ofgv19gj.png"
                }
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-sm">{post.user.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{post.createdAt.toLocaleString()}</span>

                  {privacyIcons[post.privacy]}
                </div>
              </div>
            </div>

            {/* CONTENT */}
            {post.content && (
              <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            )}

            {/* MEDIA PREVIEW */}
            <div className="space-y-2">
              {/* IMAGES */}
              {post.imageUrls?.length > 0 && (
                <div
                  className={`grid gap-2 ${
                    post.imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {post.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      className="rounded-lg w-full h-auto max-h-96 object-contain"
                    />
                  ))}
                </div>
              )}

              {/* VIDEOS */}
              {post.videoUrls?.length > 0 && (
                <div className="space-y-3">
                  {post.videoUrls.map((url, idx) => (
                    <video
                      key={idx}
                      src={url}
                      controls
                      className="rounded-lg w-full max-h-96"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* LIKE + COMMENT SECTION */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-3">
                {/* LIKE BUTTON */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Heart
                    className="w-4 h-4"
                    fill={post.likes.length > 0 ? "red" : "none"}
                    stroke={post.likes.length > 0 ? "red" : "currentColor"}
                  />
                  <span className="text-sm">{post.likes?.length || 0}</span>
                </Button>

                {/* COMMENT BUTTON */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments?.length || 0}</span>
                </Button>
              </div>
            </div>

            {/* COMMENTS PREVIEW */}
            {post.comments?.length > 0 && (
              <div className="space-y-2 mt-2">
                {post.comments.slice(0, 2).map((c) => (
                  <div key={c.id} className="flex gap-2 text-sm">
                    <img
                      src={c.user.profilePicture ?? ""}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-medium">{c.user.name}</span>{" "}
                      <span className="text-muted-foreground">{c.content}</span>
                    </div>
                  </div>
                ))}

                {/* SHOW MORE */}
                {post.comments.length > 2 && (
                  <button className="text-xs text-blue-500 hover:underline">
                    View all {post.comments.length} comments
                  </button>
                )}
              </div>
            )}

            {/* COMMENT INPUT */}
            {userId && profilePic && (
              <div className="flex items-center gap-2 pt-2">
                <img
                  src={profilePic}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <Input placeholder="Add a comment..." className="text-sm" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Feed;
