import { email, z } from "zod";

export interface ApiConfig<TResponse, TPayload = undefined> {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  payload?: TPayload;
  responseSchema?: z.ZodSchema<TResponse>;
  payloadSchema?: z.ZodSchema<TPayload>;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

// Base User Schema
export const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  privacy: z.enum(["Public", "Private", "Friends"]),
  isVerified: z.boolean(),
  profilePicture: z.string().nullable(),
  coverPicture: z.string().nullable(),
  bio: z.string(),
  dateOfBirth: z.coerce.date().nullable(),
  isActive: z.boolean(),
  lastLogin: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type User = z.infer<typeof userSchema>;
//  Generic API response wrapper
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(), // or z.literal(true) if always true
    data: dataSchema,
    message: z.string(),
    timestamp: z.coerce.date(),
  });

// Endpoint-specific "data" schemas
const AuthserResponse = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  profilePicture: z.string().nullable(),
  coverPicture: z.string().nullable(),
  bio: z.string().nullable(),
  dateOfBirth: z.coerce.date().nullable(),
  isVerified: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  lastLogin: z.coerce.date().nullable(),
  privacy: z.enum(["Public", "Private", "Friends"]),
});
// Register Endpoint API Type
export const registerDataSchema = z.object({
  user: AuthserResponse,
});

// Composed Endpoint Schemas
export const registerResponseSchema = apiResponseSchema(registerDataSchema);

//Inferred Types
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// Login Endpoint API Type

export const loginDataSchema = z.object({
  user: AuthserResponse,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const loginResponseSchema = apiResponseSchema(loginDataSchema);

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const OTPSchema = z.object({
  id: z.uuid(),
  email: email(),
  otpHash: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});

export const generateOTPResponseSchema = apiResponseSchema(OTPSchema);

export type GenerateOTPResponse = z.infer<typeof generateOTPResponseSchema>;
export const verifyOTPDataSchema = z.object({
  verified: z.boolean(),
  email: z.email(),
});
export const verifyOTPResponseSchema = apiResponseSchema(verifyOTPDataSchema);

export type VerifyOTPResponse = z.infer<typeof verifyOTPResponseSchema>;

export const verifyUserSchema = z.object({
  id: z.uuid(),
});

export const VerifyUserResponseSchema = apiResponseSchema(verifyUserSchema);
export type VerifyUserResponse = z.infer<typeof VerifyUserResponseSchema>;

export const logoutSchema = apiResponseSchema(z.null());
export type LogoutResponse = z.infer<typeof logoutSchema>;

export const updateUserDataSchema = z.object({
  user: userSchema,
});

export const updateResponseSchema = apiResponseSchema(updateUserDataSchema);

export type UpdateUserResponse = z.infer<typeof updateResponseSchema>;
