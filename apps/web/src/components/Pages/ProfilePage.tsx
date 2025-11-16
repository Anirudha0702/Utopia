import useAuthStore from "@/store/authStore";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import UpdateUserForm from "../forms/updateUser";

function ProfilePage() {
  const auth = useAuthStore();
  const [updateDialog, setUpdateDialog] = useState(false);

  const handleOpenUpdateDialog = () => {
    setUpdateDialog(true);
  };

  if (!auth.user) return <div>Loading...</div>;
  return (
    <div className="px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <img
            src={auth.user?.coverPicture || "/images/bg_cover_default.svg"}
            alt="Cover"
            className="w-full h-56 object-cover rounded-b-lg"
          />
          <Button
            className="absolute top-2 right-2"
            onClick={handleOpenUpdateDialog}
          >
            Edit
          </Button>
        </div>
        <div className="w-full " id="profile_kpis">
          <div className="-mt-30 flex items-start gap-2">
            <div className="relative group w-fit ml-8">
              <Avatar className="size-40 border-4 border-white shadow-md">
                <AvatarImage
                  src={
                    auth.user?.profilePicture ??
                    `https://res.cloudinary.com/dmz0cwtzd/image/upload/v1715690920/xeqy2nknjul9ofgv19gj.png`
                  }
                  alt={auth.user?.name}
                  className="object-cover"
                />
                <AvatarFallback>
                  {(auth.user?.name || "CN").slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div
                className="
    absolute inset-0 rounded-full bg-black/50
    flex items-center justify-center
    opacity-0 group-hover:opacity-100
    transition-opacity duration-200
    cursor-pointer
  "
                onClick={handleOpenUpdateDialog}
              >
                <span className="text-white font-medium">
                  <Pencil />
                </span>
              </div>
            </div>
            <div className="z-10 mt-4">
              <h1 className="text-2xl font-bold">{auth.user.name}</h1>
              <p className="text-gray-600">{auth.user.email}</p>
            </div>
          </div>
          <div className="justify-self-end -mt-5">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">0</span>
                <span className="text-sm text-muted-foreground">Friends</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">0</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">1</span>
                <span className="text-sm text-muted-foreground">Following</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">1</span>
                <span className="text-sm text-muted-foreground">
                  Private Videos
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">2</span>
                <span className="text-sm text-muted-foreground">
                  Public Videos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>

          <UpdateUserForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
