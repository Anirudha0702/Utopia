import { IsOptional, IsString } from 'class-validator';
export class CreatePostDto {
  @IsString()
  userId: string;
  @IsString()
  txtContent: string;
}
