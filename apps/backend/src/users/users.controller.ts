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
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Injectable } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Injectable()
// export class FileSizeValidationPipe implements PipeTransform {
//   transform(value: any, metadata: ArgumentMetadata) {
//     // "value" is an object containing the file's attributes and metadata
//     const oneKb = 1000;
//     return value.size < oneKb;
//   }
// }
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
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      coverPicture?: Express.Multer.File[];
    },
    @Body() updatedInfo: UpdateUserDto,
  ) {
    return this.usersService.update(
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
