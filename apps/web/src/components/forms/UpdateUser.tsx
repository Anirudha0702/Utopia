import { UpdateUserFormSchema, type UpdateUser } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import useAuthStore from "@/store/authStore";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { CalendarIcon, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useApiMutation } from "@/hooks/useApi";
import {
  updateResponseSchema,
  type ApiError,
  type UpdateUserResponse,
  type User,
} from "@/types/api";
import { toast } from "sonner";
interface UpdateUserFormProps {
  onClose: (user: User | null) => void;
}
function UpdateUserForm({ onClose }: UpdateUserFormProps) {
  const store = useAuthStore();
  const [wannaChangePassword, setWannaChangePassword] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const genderAlreadySet = false;
  const [profilePreview, setProfilePreview] = useState(
    store.user?.profilePicture ?? null
  );
  const [coverPreview, setCoverPreview] = useState(
    store.user?.coverPicture ?? null
  );
  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (s: string | null) => void,
    fieldSetter: (f: File | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setter(URL.createObjectURL(file));
    fieldSetter(file);
  };

  const handlePasswordChangeClick = () =>
    setWannaChangePassword(!wannaChangePassword);

  const form = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: store.user?.name || "",
      dob: undefined,
      gender: undefined,
      bio: undefined,
      password: undefined,
      profilePicture: undefined,
      coverPicture: undefined,
      currentpassword: undefined,
    },
  });

  const updateProfile = useApiMutation<UpdateUserResponse, FormData>(
    {
      endpoint: `/users/${store.user?.id}`,
      method: "PATCH",
      responseSchema: updateResponseSchema,
    },
    {
      onSuccess: (_data) => {
        const { user } = _data.data;

        onClose(user);
        toast.success(_data.message || "Login successful!");
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Login failed. Please try again.");
        console.log(error);
        onClose(null);
      },
    }
  );
  const onSubmit = (values: UpdateUser) => {
    const formData = new FormData();

    // append text fields
    formData.append("name", values.name || "");
    formData.append("bio", values.bio || "");
    formData.append("dob", date?.toISOString() || "");
    formData.append("gender", values.gender || "");

    // OPTIONAL file fields
    if (values.profilePicture instanceof File) {
      formData.append("profilePicture", values.profilePicture);
    }

    if (values.coverPicture instanceof File) {
      formData.append("coverPicture", values.coverPicture);
    }

    // password fields (optional)
    if (values.currentpassword) {
      formData.append("currentPassword", values.currentpassword);
    }
    if (values.password) {
      formData.append("newPassword", values.password);
    }

    updateProfile.mutate(formData);
  };
  if (!store.user) return <div>Loading...</div>;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 relative"
      >
        {/* COVER UPLOAD */}
        <FormField
          control={form.control}
          name="coverPicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Photo</FormLabel>
              <FormControl>
                <div className="relative w-full h-30 rounded-xl overflow-hidden bg-muted cursor-pointer">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="cover"
                      className="object-cover absolute h-full w-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Upload cover image
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      handleFile(e, setCoverPreview, field.onChange)
                    }
                    disabled={updateProfile.isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* PROFILE PICTURE */}
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex justify-center">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border cursor-pointer">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="profile"
                        // fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                        Upload
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={updateProfile.isPending}
                      onChange={(e) =>
                        handleFile(e, setProfilePreview, field.onChange)
                      }
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <label className="font-medium">Email</label>
        <Input placeholder="Your name" disabled value={store.user?.email} />

        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your name"
                  {...field}
                  disabled={updateProfile.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="About yourself..."
                  {...field}
                  disabled={updateProfile.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex  gap-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? field.value.toString() : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={field.value as Date | undefined}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          field.onChange(date?.toDateString());
                        }}
                        disabled={(d) => d > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      disabled={genderAlreadySet}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  {genderAlreadySet && (
                    <p className="text-xs text-muted-foreground">
                      Gender can be selected only once.
                    </p>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <span
          className="underline  text-sm cursor-pointer mb-2 block"
          onClick={handlePasswordChangeClick}
        >
          {wannaChangePassword
            ? "Dont want to change password?"
            : "Change password?"}
        </span>

        {wannaChangePassword && (
          <>
            <FormField
              control={form.control}
              name="currentpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      {...field}
                      disabled={updateProfile.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                      disabled={updateProfile.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-28"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UpdateUserForm;
