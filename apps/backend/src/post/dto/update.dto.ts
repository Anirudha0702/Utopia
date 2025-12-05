import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
