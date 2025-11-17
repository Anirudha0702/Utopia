// src/common/decorators/require-auth.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic' as const;

export const RequireAuth = () => SetMetadata(IS_PUBLIC_KEY, false);
