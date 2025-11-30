import { IsOptional, IsString } from 'class-validator';
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
