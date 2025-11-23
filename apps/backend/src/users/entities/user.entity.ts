import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Like } from '../../post/entities/like.entity';
import { Comment } from '../../post/entities/comment.entity';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum Privacy {
  PUBLIC = 'Public',
  FRIENDS = 'Friends',
  PRIVATE = 'Private',
}

export enum OAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  GITHUB = 'github',
  // add more as needed
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/dnmshy1ag/image/upload/v1763277858/flat-design-male-female-symbols_23-2149288474_yhj2i1.webp',
  })
  profilePicture: string;

  @Column({
    nullable: true,
    default:
      'https://res.cloudinary.com/dnmshy1ag/image/upload/v1763277703/360_F_1058923741_Ug7YblqBl7rRxNeJ5iOxvONEZys87NqC_ebaw9d.webp',
  })
  coverPicture: string;

  @Column({ nullable: true, length: 160 })
  bio: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @OneToMany(() => OauthUser, (oauth) => oauth.user)
  oauthAccounts: OauthUser[];

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User)
  @JoinTable()
  following: User[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: Privacy, default: Privacy.PUBLIC })
  privacy: Privacy;

  @Column({ default: true })
  notifications: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;
}

@Entity()
export class OauthUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Link to the main User entity
  @ManyToOne(() => User, (user) => user.oauthAccounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ type: 'enum', enum: OAuthProvider })
  provider: OAuthProvider;

  @Column()
  providerId: string;

  @CreateDateColumn()
  createdAt: Date;
}
