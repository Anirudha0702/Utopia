import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UploadService } from 'src/upload/upload.service';
import { matchHash } from 'src/utils/security';
import { InternalUser } from 'src/auth/dto/auth.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly uploadService: UploadService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, verified = false } = createUserDto;

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isVerified: verified,
    });
    return await this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    profilePicture?: Express.Multer.File,
    coverPicture?: Express.Multer.File,
  ) {
    try {
      const user = await this.findOneById(id);
      if (!user) throw new NotFoundException('user not found');
      if (profilePicture) {
        if (profilePicture) {
          const res = await this.uploadService.uploadFromBuffer(
            profilePicture,
            `profile_pictures/${id}`,
          );

          if ('secure_url' in res) {
            user.profilePicture = res.secure_url as string;
          } else {
            throw new BadRequestException(res.message);
          }
        }
      }
      if (coverPicture) {
        const res = await this.uploadService.uploadFromBuffer(
          coverPicture,
          `cover_pictures/${id}`,
        );
        if ('secure_url' in res) {
          user.coverPicture = res.secure_url as string;
        } else {
          throw new BadRequestException(res.message);
        }
      }

      if (updateUserDto.name) user.name = updateUserDto.name;
      if (!user.dateOfBirth && updateUserDto.dob)
        user.dateOfBirth = new Date(updateUserDto.dob);
      if (updateUserDto.bio) user.bio = updateUserDto.bio;

      if (updateUserDto.currentPassword && updateUserDto.newPassword) {
        const passwordMatched = await matchHash(
          updateUserDto.currentPassword,
          user.password,
        );
        if (!passwordMatched) throw new UnauthorizedException('Wrong Password');
        const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
        user.password = hashedPassword;
      }
      if (!user.gender && updateUserDto.gender)
        user.gender = updateUserDto.gender;
      const updatedUser = new InternalUser(
        await this.userRepository.save(user),
      );
      return { user: updatedUser };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({
      email,
    });
    return user;
  }
  async findOneById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    return user;
  }
}
