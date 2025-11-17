import { z } from "zod";
export const RegisterFormSchema = z
  .object({
    email: z.email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmpassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
    otp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match.",
    path: ["confirmpassword"],
  });
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

// **************** Register File Types ****************
export const FormSchema = z
  .object({
    name: z.string(),

    email: z.email("Invalid email address."),

    otp: z.string().optional(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]).+$/,
        {
          message:
            "Password must include at least one letter, one number, and one special character.",
        }
      ),

    confirmpassword: z.string().min(6, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match.",
    path: ["confirmpassword"],
  });

export type registerTypes = z.infer<typeof FormSchema>;

// **************** Login File Types ****************
export const LoginFormSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Please enter your password"),
});

export type loginTypes = z.infer<typeof LoginFormSchema>;

export const otpFormSchema = z.object({
  email: z.email("Please enter a valid email"),
  name: z.string().optional(),
});

export type OtpFormType = z.infer<typeof otpFormSchema>;

export const otpVerifySchema = z.object({
  email: z.email("Please enter a valid email"),
  otp: z.string().length(6, "OTP must be 6 characters"),
});

export type OtpVerifyType = z.infer<typeof otpVerifySchema>;

export const verifyUserSchema = z.object({
  id: z.uuid(),
});
export type VerifyUserType = z.infer<typeof verifyUserSchema>;

export const UpdateUserFormSchema = z.object({
  email: z.email("Please enter a valid email").optional(),

  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  dob: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),

  bio: z.string().max(160, "Bio must be at most 100 characters").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  currentpassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  profilePicture: z
    .custom<File>((val) => val instanceof File, {
      message: "Please upload a valid file",
    })
    .refine(
      (file) => !file || file.size <= 1.5 * 1024 * 1024,
      "Max 1.5MB allowed"
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
      "Only JPG/PNG allowed"
    )
    .optional(),

  coverPicture: z
    .custom<File>((val) => val instanceof File, {
      message: "Please upload a valid file",
    })
    .refine((file) => !file || file.size <= 3 * 1024 * 1024, "Max 3MB allowed")
    .refine(
      (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
      "Only JPG/PNG allowed"
    )
    .optional(),
});

export type UpdateUser = z.infer<typeof UpdateUserFormSchema>;
