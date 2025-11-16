import { useState } from "react";
import { Button } from "@/components/ui/button"; // shadcn button
import {
  LogOut,
  Loader2,
  MessageCircleHeart,
  BellRing,
  UserPen,
  Settings,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import Searchbar from "./Searchbar";
import { useRouter } from "@tanstack/react-router";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function Navbar() {
  const [loading, setLoading] = useState(false);
  const store = useAuthStore();
  const router = useRouter();
  async function handleSignOut() {
    try {
      setLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
      store.clearAuth();
    } catch (e) {
      console.error("Sign-out failed", e);
      setLoading(false);
    }
  }
  const handleButtonClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLButtonElement).name === "login") {
      router.navigate({ to: "/login" });
    } else {
      router.navigate({ to: "/register" });
    }
  };
  const handleMenuClick = (e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).innerText;
    if (target === "Logout") {
      handleSignOut();
    } else if (target === "Profile") {
      router.navigate({ to: "/profile" });
    }
  };

  // Handle login action
  async function onSearch() {}
  return (
    <div className="flex items-center gap-2   justify-between p-2 px-4 m-4 rounded-md  shadow-accent-foreground bg-white">
      {/* <Button
        variant="outline"
        onClick={handleSignOut}
        disabled={loading}
        className="flex items-center gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        <span>Logout</span>
      </Button>

      {askingConfirm && !loading && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Are you sure?</span>
          <Button size="sm" onClick={handleSignOut} className="min-w-[64px]">
            Yes
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAskingConfirm(false)}
            className="min-w-[64px]"
          >
            No
          </Button>
        </div>
      )} */}
      <div className="flex items-center flex-1">
        <span className=" font-semibold mr-4">
          <img src="/images/logo.webp" alt="" className="h-10 aspect-square" />
        </span>
        <Searchbar onSearch={onSearch} />
      </div>
      <div className="">
        <div
          className={`flex items-center gap-4 ${store.user ? "hidden" : ""}`}
        >
          {/* Login Button */}
          <Button
            variant="outline"
            name="login"
            onClick={handleButtonClick}
            className="
          px-6 py-2 rounded-2xl border-gray-300
          hover:text-gray-500
          shadow-sm 
          hover:bg-gray-100 hover:shadow-md 
          transition-all duration-200
        "
          >
            Login
          </Button>

          <Button
            className="
          px-6 py-2 rounded-2xl font-medium
          bg-gradient-to-r from-secondary to-primary
          text-white 
          shadow-md
          hover:shadow-lg hover:brightness-110
          hover:from-primary hover:to-secondary
          transition-all duration-200
        "
            name="signup"
            onClick={handleButtonClick}
          >
            Sign Up
          </Button>
        </div>
        <div
          className={`flex items-center gap-4 ${store.user ? "" : "hidden"}`}
        >
          <MessageCircleHeart />
          <BellRing />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage
                  src={
                    store.user?.profilePicture ??
                    `https://res.cloudinary.com/dmz0cwtzd/image/upload/v1715690920/xeqy2nknjul9ofgv19gj.png`
                  }
                  alt={store.user?.name}
                />
                <AvatarFallback>
                  {(store.user?.name || "CN").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuItem onClick={handleMenuClick}>
                Profile
                <DropdownMenuShortcut>
                  <UserPen />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Setting
                <DropdownMenuShortcut>
                  <Settings />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Logout
                <DropdownMenuShortcut>
                  <LogOut />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
