import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';
import { Express } from 'express';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.getOrThrow('CLOUDINARY_CLOUD'),
      api_key: configService.getOrThrow('CLOUDINARY_KEY'),
      api_secret: configService.getOrThrow('CLOUDINARY_SECRET'),
    });
  }

  // --------------------------------------------------------
  // Upload from Buffer (works with Multer image uploads)
  // --------------------------------------------------------
  async uploadFromBuffer(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            const err = new Error(error.message || 'Cloudinary upload failed');

            return reject(err);
          }
          resolve(result!);
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  // --------------------------------------------------------
  // Upload from File Path (optional)
  // --------------------------------------------------------
  async uploadFromPath(
    filePath: string,
    folder = 'uploads',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
  }

  //   async delete(publicId: string): Promise<{ result: string }> {
  //     return cloudinary.uploader.destroy(publicId);
  //   }

  getUrl(publicId: string, options: Record<string, any> = {}) {
    return cloudinary.url(publicId, {
      secure: true,
      ...options,
    });
  }
}
