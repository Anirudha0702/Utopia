import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Injectable } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Injectable()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'coverPicture', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      coverPicture?: Express.Multer.File[];
    },
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updatedInfo: UpdateUserDto,
  ) {
    console.log(updatedInfo);
    return await this.usersService.update(
      id,
      updatedInfo,
      files.profilePicture?.[0],
      files.coverPicture?.[0],
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
