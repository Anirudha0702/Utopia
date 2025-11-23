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
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
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
      image?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createPostDto: CreatePostDto,
  ) {
    const hasImage = files.image && files.image.length > 0;
    const hasVideo = files.video && files.video.length > 0;

    if (hasImage && hasVideo) {
      throw new BadRequestException(
        'Post can contain either image OR video, not both.',
      );
    }
    if (!hasImage && !hasVideo && !createPostDto.txtContent)
      throw new BadRequestException('Post must contain something.');
    const media = files.image?.[0] ?? files.video?.[0];
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
