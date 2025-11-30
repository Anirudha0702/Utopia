import { useRouter } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Globe,
  Image,
  Info,
  Lock,
  Smile,
  UsersRound,
  Video,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  CreatePostFormSchema,
  type CreatePostForm as _CreatePostForm,
} from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "../ui/emoji-picker";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/useApi";
import {
  createPostResponseSchema,
  type ApiError,
  type CreatePostResponse,
  type PostType,
} from "@/types/api";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
interface CreatePostFormProps {
  userId: string;
  userName: string;
  profilePicture: string | null;
  onClose?: (post: PostType | null) => void;
}

function CreatePostForm({
  userId,
  onClose,
  userName,
  profilePicture,
}: CreatePostFormProps) {
  const router = useRouter();
  const navigateToProfilePage = () => router.navigate({ to: "/profile" });
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(
    null
  );
  const form = useForm<_CreatePostForm>({
    resolver: zodResolver(CreatePostFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      medias: undefined,
      txtContent: "",
      privacy: "public",
    },
  });
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const vidInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (type: "img" | "vid") => {
    if (type == "img") imgInputRef.current?.click();
    else vidInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setPreviewUrl(null);
      setPreviewType(null);
      form.setValue("medias", undefined);
      form.setError("medias", { message: "Invalid file type" });
      return;
    }
    const url = URL.createObjectURL(file);

    setPreviewType(isImage ? "image" : "video");
    setPreviewUrl(url);

    form.setValue("medias", file);
    form.clearErrors("medias");
  };

  const createPost = useApiMutation<CreatePostResponse, FormData>(
    {
      endpoint: `/post/create`,
      method: "POST",
      responseSchema: createPostResponseSchema,
    },
    {
      onSuccess: (_data) => {
        if (onClose) onClose(_data.data);
        toast.success("Posted successfully");
      },
      onError: (error: ApiError) => {
        toast.error(
          error.message || "Failed to create Post. Please try again."
        );
        console.log(error);
        if (onClose) onClose(null);
      },
    }
  );
  const onSubmit = (values: _CreatePostForm) => {
    const formData = new FormData();
    formData.append("txtContent", values.txtContent ?? "");
    formData.append("userId", userId);
    formData.append("privacy", values.privacy ?? "public");
    if (values.medias instanceof File) {
      formData.append(
        previewType === "image" ? "images" : "videos",
        values.medias
      );
    }
    createPost.mutate(formData);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}>
        <div className="flex gap-2 items-center mb-2">
          <Avatar onClick={navigateToProfilePage} className="h-12 w-12">
            <AvatarImage
              src={
                profilePicture ??
                `https://res.cloudinary.com/dmz0cwtzd/image/upload/v1715690920/xeqy2nknjul9ofgv19gj.png`
              }
              alt={userName}
            />
            <AvatarFallback>{(userName || "CN").slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="">
            <span className="font-bold">{userName}</span>
            <FormField
              control={form.control}
              name="privacy"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={createPost.isPending}
                    >
                      <SelectTrigger className="w-[130px] p-1" size="xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="">
                        <SelectGroup>
                          <SelectItem value="public" className="flex gap-2">
                            <Globe size={10} />
                            Public
                          </SelectItem>
                          <SelectItem value="private" className="flex gap-2">
                            <Lock />
                            Private
                          </SelectItem>
                          <SelectItem
                            value="follower_only"
                            className="flex gap-2"
                          >
                            <UsersRound />
                            Followers only
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="txtContent"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <span className="text-xs ml-[87%] flex items-center gap-1 mb-2">
                    <span
                      className={
                        (field.value?.length ?? 0) > 0 &&
                        ((field.value?.length ?? 0) < 20 ||
                          (field.value?.length ?? 0) > 160)
                          ? "text-red-500"
                          : ""
                      }
                    >
                      {field.value?.length}
                    </span>
                    /160
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info
                          size={12}
                          color={
                            (field.value?.length ?? 0) > 0 &&
                            ((field.value?.length ?? 0) < 20 ||
                              (field.value?.length ?? 0) > 160)
                              ? "red"
                              : "green"
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>write atleast 20 characters</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <Textarea
                    disabled={createPost.isPending}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="What's on your mind?"
                    className={`${previewUrl ? "h-16" : "h-40"} resize-none placeholder:text-xl border-0 outline-none focus:outline-none ring-0 focus:ring-0`}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medias"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={`relative`}>
                  {previewUrl && (
                    <div className="h-40 w-40 mt-3 relative border border-transparent hover:border-black/60">
                      <button
                        onClick={() => {
                          setPreviewUrl(null);
                          setPreviewType(null);
                          form.setValue("medias", undefined);
                        }}
                        className="absolute top-0 right-0 
                            bg-black/60 text-white 
                            rounded-full p-1 
                            hover:bg-black/80 
                            transition h-8 w-8
                            z-10
                            cursor-pointer"
                      >
                        ✕
                      </button>
                      {previewType === "image" && (
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="h-40 w-40 object-cover rounded-md"
                        />
                      )}
                      {previewType === "video" && (
                        <video
                          src={previewUrl}
                          //   alt="preview"
                          controls
                          className="h-40 w-40 object-cover rounded-md"
                        />
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    ref={imgInputRef}
                    className="absolute inset-0 opacity-0 cursor-pointer hidden"
                    onChange={handleFileChange}
                    disabled={createPost.isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Image
                color="green"
                onClick={() => handleClick("img")}
                style={{ cursor: "pointer" }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Only JPG/JPEG/PNG/MP4 format is allowed</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Video className="text-gray-500/50 cursor-not-allowed" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Live is not available, will be comming soon</p>
            </TooltipContent>
          </Tooltip>

          <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger asChild>
              <Smile className="text-yellow-500" />
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <EmojiPicker
                className="h-[342px]"
                onEmojiSelect={({ emoji }) => {
                  if (createPost.isPending) return;
                  const current = form.getValues("txtContent") || "";
                  form.setValue("txtContent", current + emoji, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              >
                <EmojiPickerSearch />
                <EmojiPickerContent />
                <EmojiPickerFooter />
              </EmojiPicker>
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? "Posting" : "Post"}
        </Button>
      </form>
    </Form>
  );
}

export default CreatePostForm;
