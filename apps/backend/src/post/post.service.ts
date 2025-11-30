import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as Post, MediaType } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly uploadService: UploadService,
  ) {}
  async create(
    createPostDto: CreatePostDto,
    media?: Express.Multer.File,
    mediaType?: MediaType,
  ) {
    try {
      let mediaUrl: string | undefined = undefined;
      if (media) {
        const uploaded = await this.uploadService.uploadFromBuffer(
          media,
          `posts/${mediaType}/${createPostDto.userId}`,
        );
        if ('secure_url' in uploaded) {
          mediaUrl = uploaded.secure_url as string;
        } else {
          throw new BadRequestException(uploaded.message);
        }
      }
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      if (mediaUrl) {
        if (mediaType === MediaType.VIDEO) {
          videoUrls = [mediaUrl];
        } else {
          imageUrls = [mediaUrl];
        }
      }
      const post = this.postRepository.create({
        content: createPostDto.txtContent,
        imageUrls,
        videoUrls,
        privacy: createPostDto.privacy,
        user: { id: createPostDto.userId },
      });

      const entry = await this.postRepository.save(post);
      return entry;
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  async findAll() {
    const posts = await this.postRepository.find({
      relations: ['user'],
    });
    posts.forEach((post) => console.log(post.user.name));
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
