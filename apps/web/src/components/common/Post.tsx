import { Globe, Heart, MessageCircle, UsersRound, Lock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useApiMutation } from "@/hooks/useApi";
import {
  createCommentResponseSchema,
  LikeDislikeResponseSchema,
  type ApiError,
  type CreateCommentResponse,
  type LikeDislikePostResponse,
} from "@/types/api";
import {
  CreateCommentPayloadSchema,
  LikeDislikePayloadSchema,
  type CreateCommentPayload,
  type LikeDislikePayload,
} from "@/types/type";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
const privacyIcons = {
  public: <Globe size={14} />,
  private: <Lock size={14} />,
  follower_only: <UsersRound size={14} />,
};
interface PostProps {
  post: {
    id: string;
    content: string | null;
    videoUrls: string[];
    imageUrls: string[];
    privacy: "private" | "public" | "follower_only";
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      email: string;
      name: string;
      profilePicture: string | null;
    };
    likes: {
      id: string;
      user: {
        id: string;
        email: string;
        name: string;
        profilePicture: string | null;
      };
    }[];
    comments: {
      id: string;
      content: string;
      createdAt: Date;
      user: {
        id: string;
        email: string;
        name: string;
        profilePicture: string | null;
      };
    }[];
  };
}
function Post({ post }: PostProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();

  const [input, setInput] = useState("");
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const currentUserLiked = likes.some((like) => like.user.id === user?.id);
  const likeDislike = useApiMutation<
    LikeDislikePostResponse,
    LikeDislikePayload
  >(
    {
      endpoint: `/post/like`,
      method: "POST",
      responseSchema: LikeDislikeResponseSchema,
      payloadSchema: LikeDislikePayloadSchema,
    },
    {
      onSuccess: (_data) => {
        if (currentUserLiked)
          setLikes(likes.filter((like) => like.user.id !== user?.id));
        else if (typeof _data.data !== "boolean")
          setLikes([...likes, _data.data]);
      },
      onError: (error: ApiError) => {
        console.log(error);
      },
    }
  );

  const comment = useApiMutation<CreateCommentResponse, CreateCommentPayload>(
    {
      endpoint: `/post/comment`,
      method: "POST",
      responseSchema: createCommentResponseSchema,
      payloadSchema: CreateCommentPayloadSchema,
    },
    {
      onSuccess: (_data) => {
        setComments([...comments, _data.data]);
        setInput("");
      },
      onError: (error: ApiError) => {
        console.log(error);
      },
    }
  );
  const handleLikeDislike = () => {
    if (!user) {
      toast.error("Please login to interact with post");
      return;
    }
    likeDislike.mutate({
      postId: post.id,
      userId: user.id,
      liked: !currentUserLiked,
    });
  };
  const handleDialogOpen = () => setOpen(!open);
  const createComment = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!user) {
      toast.error("Please login to interact with post");
      return;
    }
    if (e.key !== "Enter") return;
    comment.mutate({ postId: post.id, userId: user.id, comment: input });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    setLikes(post.likes);
    setComments(post.comments);
  }, [post]);
  return (
    <>
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
          <div className="space-y-2" onClick={handleDialogOpen}>
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
                onClick={handleLikeDislike}
              >
                <Heart
                  className="w-4 h-4"
                  fill={likes.length > 0 || currentUserLiked ? "red" : "none"}
                  stroke={
                    likes.length > 0 || currentUserLiked
                      ? "red"
                      : "currentColor"
                  }
                />
                <span className="text-sm">{likes.length || 0}</span>
              </Button>

              {/* COMMENT BUTTON */}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments.length || 0}</span>
              </Button>
            </div>
          </div>

          {/* COMMENTS PREVIEW */}
          {comments.length > 0 && (
            <div className="space-y-2 mt-2">
              {comments.slice(0, 2).map((c) => (
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
              {comments.length > 2 && (
                <button
                  className="text-xs text-blue-500 hover:underline"
                  onClick={handleDialogOpen}
                >
                  View all {comments.length} comments
                </button>
              )}
            </div>
          )}

          {/* COMMENT INPUT */}
          {user && (
            <div className="flex items-center gap-2 pt-2">
              <img
                src={user.profilePicture ?? ""}
                className="h-8 w-8 rounded-full object-cover"
              />
              <Input
                placeholder="Add a comment..."
                className="text-sm"
                onKeyDown={createComment}
                value={input}
                onChange={onChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
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
                      post.imageUrls.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2"
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
                    onClick={handleLikeDislike}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={
                        likes.length > 0 || currentUserLiked ? "red" : "none"
                      }
                      stroke={
                        likes.length > 0 || currentUserLiked
                          ? "red"
                          : "currentColor"
                      }
                    />
                    <span className="text-sm">{likes.length || 0}</span>
                  </Button>

                  {/* COMMENT BUTTON */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{comments.length || 0}</span>
                  </Button>
                </div>
              </div>

              {/* COMMENTS PREVIEW */}
              {comments?.length > 0 && (
                <div className="space-y-2 mt-2">
                  {comments.map((c) => (
                    <div key={c.id} className="flex gap-2 text-sm">
                      <img
                        src={c.user.profilePicture ?? ""}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-medium">{c.user.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {c.content}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* COMMENT INPUT */}
              {user && (
                <div className="flex items-center gap-2 pt-2">
                  <img
                    src={user.profilePicture ?? ""}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <Input
                    placeholder="Add a comment..."
                    className="text-sm"
                    onKeyDown={createComment}
                    value={input}
                    onChange={onChange}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Post;
