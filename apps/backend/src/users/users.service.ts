import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UploadService } from 'src/upload/upload.service';
import { Express } from 'express';
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
        const res = await this.uploadService.uploadFromBuffer(
          profilePicture,
          'profile_pictures',
        );
        user.profilePicture = res.secure_url as string;
      }
      if (coverPicture) {
        const res = await this.uploadService.uploadFromBuffer(
          coverPicture,
          'cover_pictures',
        );
        user.coverPicture = res.secure_url as string;
      }
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error('sd');
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

  async upload(file: Express.Multer.File) {
    await this.uploadService.uploadFromBuffer(file);
  }
}
