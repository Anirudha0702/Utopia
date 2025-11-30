import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post?: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment?: Comment;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
