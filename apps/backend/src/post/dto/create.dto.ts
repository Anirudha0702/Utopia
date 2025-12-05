import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PostPrivacy } from '../entities/post.entity';
export class CreatePostDto {
  @IsString()
  userId: string;
  @IsString()
  txtContent: string;
  @IsOptional()
  @IsString()
  privacy?: PostPrivacy;
}

export class LikeDislikePostDto {
  @IsString()
  postId: string;
  @IsString()
  userId: string;
  @IsBoolean()
  liked: boolean;
}
export class CreateCommentDto {
  @IsString()
  postId: string;
  @IsString()
  userId: string;
  @IsString()
  comment: string;
}
