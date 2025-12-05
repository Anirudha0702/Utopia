import { email, z } from "zod";

export interface ApiConfig<TResponse, TPayload = undefined> {
  endpoint: string;
  key?: string;
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

export const PostSchema = z.object({
  id: z.uuid(),
  content: z.string().nullable(),
  videoUrls: z.string().array(),
  imageUrls: z.string().array(),
  privacy: z.literal(["private", "public", "follower_only"]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  user: z.object({
    id: z.uuid(),
  }),
});
const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) {
    const date = new Date(arg);
    console.log(arg, date);
    return isNaN(date.getTime()) ? undefined : date; // invalid date → undefined
  }
  return undefined;
}, z.date());
export const FeedPostSchema = z.object({
  id: z.uuid(),
  content: z.string().nullable(),
  videoUrls: z.string().array(),
  imageUrls: z.string().array(),
  privacy: z.literal(["private", "public", "follower_only"]),
  createdAt: dateSchema,
  updatedAt: z.coerce.date(),
  user: z.object({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    profilePicture: z.string().nullable(),
  }),
  likes: z
    .object({
      id: z.uuid(),
      user: z.object({
        id: z.uuid(),
        email: z.email(),
        name: z.string(),
        profilePicture: z.string().nullable(),
      }),
    })
    .array(),
  comments: z
    .object({
      id: z.uuid(),
      content: z.string(),
      createdAt: z.coerce.date(),
      user: z.object({
        id: z.uuid(),
        email: z.email(),
        name: z.string(),
        profilePicture: z.string().nullable(),
      }),
    })
    .array(),
});
export type PostType = z.infer<typeof PostSchema>;

export const createPostResponseSchema = apiResponseSchema(PostSchema);
export type CreatePostResponse = z.infer<typeof createPostResponseSchema>;

export const feedSchema = FeedPostSchema.array();
export const feedResponseSchema = apiResponseSchema(feedSchema);
export type UserFeedResponse = z.infer<typeof feedResponseSchema>;

export const LikeDislikeResponseSchema = apiResponseSchema(
  z.union([
    z.boolean(),
    z.object({
      id: z.string().uuid(),
      user: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        name: z.string(),
        profilePicture: z.string().nullable(),
      }),
    }),
  ])
);
export type LikeDislikePostResponse = z.infer<typeof LikeDislikeResponseSchema>;

export const createCommentResponseSchema = apiResponseSchema(
  z.object({
    id: z.uuid(),
    content: z.string(),
    createdAt: z.coerce.date(),
    user: z.object({
      id: z.uuid(),
      email: z.email(),
      name: z.string(),
      profilePicture: z.string().nullable(),
    }),
  })
);

export type CreateCommentResponse = z.infer<typeof createCommentResponseSchema>;
