import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from 'src/upload/upload.service';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Like, Comment])],
  controllers: [PostController],
  providers: [PostService, UploadService, RedisService, UserService],
  exports: [PostService],
})
export class PostModule {}
