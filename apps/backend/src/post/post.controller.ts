import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';
import { MediaType } from './entities/post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 1 },
        { name: 'videos', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB limit
        },
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createPostDto: CreatePostDto,
  ) {
    const hasImage = files.images && files.images.length > 0;
    const hasVideo = files.videos && files.videos.length > 0;

    if (hasImage && hasVideo) {
      throw new BadRequestException(
        'Post can contain either image OR video, not both.',
      );
    }
    if (!hasImage && !hasVideo && !createPostDto.txtContent)
      throw new BadRequestException('Post must contain something.');
    const media = files.images?.[0] ?? files.videos?.[0];
    const mediaType = hasImage
      ? MediaType.IMAGE
      : hasVideo
        ? MediaType.VIDEO
        : undefined;
    return await this.postService.create(createPostDto, media, mediaType);
  }

  @Get('s')
  async findAll() {
    return await this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
