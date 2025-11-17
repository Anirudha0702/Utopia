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
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { CalendarIcon, Upload } from "lucide-react";
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

function UpdateUserForm() {
  const store = useAuthStore();
  const [open, setOpen] = useState(false);
  const [wannaChangePassword, setWannaChangePassword] = useState(false);
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

  const onSubmit = (values: UpdateUser) => {
    console.log("FINAL SUBMIT DATA → ", values);
    setOpen(false);
  };
  const handlePasswordChangeClick = () =>
    setWannaChangePassword(!wannaChangePassword);

  const form = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: store.user?.email || "",
      name: store.user?.name || "",
      dob: "",
      gender: undefined,
      bio: "",
      password: undefined,
      profilePicture: undefined,
      coverPicture: undefined,
      currentpassword: undefined,
    },
  });
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileRef.current?.click();
  if (!store.user) return <div>Loading...</div>;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                    {profilePreview && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded"
                        onClick={() => {
                          setProfilePreview(null);
                          field.onChange(undefined);
                        }}
                      >
                        ✕
                      </button>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
                <Textarea rows={3} placeholder="Short bio..." {...field} />
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
                        onSelect={(date) =>
                          field.onChange(date?.toDateString())
                        }
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
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="flex justify-end">
          <Button type="submit" className="right-0">
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UpdateUserForm;
