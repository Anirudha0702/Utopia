import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import {
  CreateCommentDto,
  CreatePostDto,
  LikeDislikePostDto,
} from './dto/create.dto';
import { UpdatePostDto } from './dto/update.dto';
import { Post as Post, MediaType, PostPrivacy } from './entities/post.entity';
import { In, Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { UserService } from 'src/users/users.service';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class PostService {
  private readonly PUBLIC_FEED_KEY = 'feed:public';
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly uploadService: UploadService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
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
  async getPublicFeed(limit = 20): Promise<Post[]> {
    try {
      const postIds = await this.redisService.lrange(
        this.PUBLIC_FEED_KEY,
        0,
        limit - 1,
      );

      if (postIds.length === 0) {
        // Redis cold start: fetch latest posts from DB
        const posts = await this.postRepository.find({
          order: { createdAt: 'DESC' },
          where: { privacy: PostPrivacy.PUBLIC },
          take: limit,
          relations: {
            user: true, // post owner
            comments: {
              // fetch comments
              user: true, // fetch the user who made each comment
            },
            likes: {
              user: true, // (optional) fetch who liked
            },
          },
          select: {
            id: true,
            content: true,
            imageUrls: true,
            videoUrls: true,
            privacy: true,
            createdAt: true,
            updatedAt: true,

            user: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },

            likes: {
              id: true,
              user: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },

            comments: {
              id: true,
              content: true,
              createdAt: true,
              user: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        });

        // Cache post IDs in Redis
        for (const post of posts) {
          await this.redisService.lpush(this.PUBLIC_FEED_KEY, post.id);
        }
        await this.redisService.ltrim(this.PUBLIC_FEED_KEY, 99);

        return posts;
      }

      // Fetch posts by IDs
      const posts = await this.postRepository.find({
        where: { id: In(postIds), privacy: PostPrivacy.PUBLIC },
        order: { createdAt: 'DESC' },
        take: limit,
        relations: {
          user: true,
          likes: { user: true },
          comments: { user: true },
        },
        select: {
          id: true,
          content: true,
          imageUrls: true,
          videoUrls: true,
          privacy: true,
          createdAt: true,
          updatedAt: true,

          user: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },

          likes: {
            id: true,
            user: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },

          comments: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },
        },
      });

      return posts;
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
  async getPersonalFeed(userId: string, limit = 20): Promise<Post[]> {
    try {
      const userKey = `user:${userId}`;
      const postIds = await this.redisService.lrange(userKey, 0, limit - 1);
      if (postIds.length === 0) {
        const user = await this.userService.getFollowersOfUser(userId);
        if (!user) throw new NotFoundException('user not found');
        const followingIds = user.following.map((f) => f.id);
        const posts = await this.postRepository.find({
          where: [
            {
              privacy: PostPrivacy.PUBLIC,
            },
            {
              user: {
                id: In(followingIds.length ? followingIds : []),
              },
              privacy: In([PostPrivacy.PUBLIC, PostPrivacy.FOLLOWER_ONLY]),
            },

            {
              user: { id: userId },
            },
          ],

          order: { createdAt: 'DESC' },
          take: limit,

          relations: {
            user: true,
            comments: { user: true },
            likes: { user: true },
          },

          select: {
            id: true,
            content: true,
            imageUrls: true,
            videoUrls: true,
            privacy: true,
            createdAt: true,
            updatedAt: true,

            user: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },

            comments: {
              id: true,
              content: true,
              createdAt: true,
              user: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },

            likes: {
              id: true,
              user: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        });

        // Cache post IDs in Redis
        for (const post of posts) {
          await this.redisService.lpush(userKey, post.id);
        }
        await this.redisService.ltrim(userKey, 99);

        return posts;
      }
      const posts = await this.postRepository.find({
        where: { id: In(postIds) },
        order: { createdAt: 'DESC' },
        take: limit,
        relations: {
          user: true,
          likes: { user: true },
          comments: { user: true },
        },
        select: {
          id: true,
          content: true,
          imageUrls: true,
          videoUrls: true,
          privacy: true,
          createdAt: true,
          updatedAt: true,

          user: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },

          likes: {
            id: true,
            user: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },

          comments: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },
        },
      });

      return posts;
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
    throw new NotImplementedException();
  }

  async likeDislikePost(actionInfo: LikeDislikePostDto) {
    try {
      const { postId, userId, liked } = actionInfo;

      // 1️⃣ Validate post exists
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // 2️⃣ Validate user exists
      const user = await this.userService.findOneById(userId);
      const existingLike = await this.likeRepository.findOne({
        where: {
          post: { id: postId },
          user: { id: userId },
        },
        relations: ['post', 'user'],
      });
      if (!user) throw new NotFoundException('User not found');
      if (liked) {
        if (existingLike) {
          return true;
        }

        const like = this.likeRepository.create({
          post,
          user,
        });

        return await this.likeRepository.save(like);
      }

      // 5️⃣ Disliking the post
      if (!liked) {
        if (!existingLike) {
          return true;
        }

        await this.likeRepository.remove(existingLike);
        return true;
      }
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  async createComment(actionInfo: CreateCommentDto) {
    try {
      const { postId, userId, comment } = actionInfo;
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // 2️⃣ Validate user exists
      const user = await this.userService.findOneById(userId);
      if (!user) throw new NotFoundException('User not found');
      const _comment = this.commentRepository.create({
        content: comment,
        user,
        post,
      });
      return await this.commentRepository.save(_comment);
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }
}
