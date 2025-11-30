import useAuthStore from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "../ui/dialog";
import { Image, Video } from "lucide-react";
import CreatePostForm from "../forms/CreatePost";

function CreatePost() {
  const auth = useAuthStore();
  const router = useRouter();
  const [showCreatePostDialog, setShowCreatePostDialog] = useState(false);
  const navigateToProfilePage = () => router.navigate({ to: "/profile" });
  const handleShowCreatePostDialog = () =>
    setShowCreatePostDialog(!showCreatePostDialog);
  if (!auth.user) return null;

  return (
    <Card className="w-full h-16 p-0.5 px-2 flex flex-row items-center gap-2">
      <Avatar onClick={navigateToProfilePage}>
        <AvatarImage
          src={
            auth.user?.profilePicture ??
            `https://res.cloudinary.com/dmz0cwtzd/image/upload/v1715690920/xeqy2nknjul9ofgv19gj.png`
          }
          alt={auth.user?.name}
        />
        <AvatarFallback>{(auth.user?.name || "CN").slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div
        className="flex grow items-center gap-2"
        onClick={handleShowCreatePostDialog}
      >
        <div className="grow bg-gray-400/10 w-full rounded-full p-1.5 px-4">
          What's on your mind, {auth.user?.name.slice(0, 7)}?
        </div>
        <Image color="green" size={32} />
        <Video className="text-gray-500/50 cursor-not-allowed" size={32} />
      </div>
      <Dialog
        open={showCreatePostDialog}
        onOpenChange={setShowCreatePostDialog}
      >
        <DialogContent>
          <DialogHeader className="">
            <DialogTitle>Create post</DialogTitle>
          </DialogHeader>

          <CreatePostForm
            userId={auth.user.id}
            onClose={() => {
              setShowCreatePostDialog(false);
            }}
            profilePicture={auth.user.profilePicture}
            userName={auth.user.name}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default CreatePost;
