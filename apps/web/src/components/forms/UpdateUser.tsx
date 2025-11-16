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
      password: "",
      profilePicture: undefined,
      coverPicture: undefined,
    },
  });
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileRef.current?.click();
  if (!store.user) return <div>Loading...</div>;
  return (
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //     {/* COVER PHOTO */}
    //     <FormField
    //       control={form.control}
    //       name="coverPicture"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Cover Photo</FormLabel>
    //           <FormControl>
    //             <div className="relative w-full h-36 rounded-xl overflow-hidden bg-muted group">
    //               {coverPreview ? (
    //                 <img
    //                   src={coverPreview}
    //                   alt="Cover preview"
    //                   className="w-full h-full object-cover"
    //                 />
    //               ) : (
    //                 <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
    //                   Upload cover photo
    //                 </div>
    //               )}

    //               {/* REMOVE BTN */}
    //               {coverPreview && (
    //                 <button
    //                   type="button"
    //                   onClick={() => {
    //                     setCoverPreview(null);
    //                     field.onChange(undefined);
    //                   }}
    //                   className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded"
    //                 >
    //                   Remove
    //                 </button>
    //               )}

    //               {/* FILE PICKER */}
    //               <input
    //                 type="file"
    //                 accept="image/*"
    //                 className="absolute inset-0 opacity-0 cursor-pointer"
    //                 onChange={(e) => {
    //                   const f = e.target.files?.[0];
    //                   if (f) {
    //                     setCoverPreview(URL.createObjectURL(f));
    //                     field.onChange(f);
    //                   }
    //                 }}
    //               />
    //             </div>
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     {/* PROFILE PHOTO */}
    //     <FormField
    //       control={form.control}
    //       name="profilePicture"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Profile Picture</FormLabel>
    //           <FormControl>
    //             <div className="flex justify-center">
    //               <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border group">
    //                 {profilePreview ? (
    //                   <img
    //                     src={profilePreview}
    //                     alt="Profile preview"
    //                     className="w-full h-full object-cover"
    //                   />
    //                 ) : (
    //                   <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
    //                     Upload
    //                   </div>
    //                 )}

    //                 {/* REMOVE BTN */}
    //                 {profilePreview && (
    //                   <button
    //                     type="button"
    //                     onClick={() => {
    //                       setProfilePreview(null);
    //                       field.onChange(undefined);
    //                     }}
    //                     className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 py-0.5 rounded"
    //                   >
    //                     ✕
    //                   </button>
    //                 )}

    //                 {/* FILE PICKER */}
    //                 <input
    //                   type="file"
    //                   accept="image/*"
    //                   className="absolute inset-0 opacity-0 cursor-pointer"
    //                   onChange={(e) => {
    //                     const f = e.target.files?.[0];
    //                     if (f) {
    //                       setProfilePreview(URL.createObjectURL(f));
    //                       field.onChange(f);
    //                     }
    //                   }}
    //                 />
    //               </div>
    //             </div>
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     {/* NAME FIELD */}
    //     <FormField
    //       control={form.control}
    //       name="name"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Name</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Your name" {...field} />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     {/* BIO */}
    //     <FormField
    //       control={form.control}
    //       name="bio"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Bio</FormLabel>
    //           <FormControl>
    //             <Textarea rows={3} placeholder="Short bio..." {...field} />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />

    //     <Button type="submit" className="w-full">
    //       Save Changes
    //     </Button>
    //   </form>
    // </Form>

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
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-muted cursor-pointer">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="cover"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      Upload cover image
                    </div>
                  )}

                  {coverPreview && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setCoverPreview(null);
                        field.onChange(undefined);
                      }}
                    >
                      Remove
                    </Button>
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

        {/* DOB */}
        {/* <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
                    onSelect={(date) => field.onChange(date?.toDateString())}
                    disabled={(d) => d > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GENDER (LOCK AFTER FIRST SET) */}
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
                  <SelectTrigger>
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

        {/* PASSWORD */}
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
      </form>
    </Form>
  );
}

export default UpdateUserForm;
