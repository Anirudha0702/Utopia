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
