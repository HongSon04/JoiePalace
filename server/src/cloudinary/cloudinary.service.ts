// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary/cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadFileToFolder(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse | any> {
    return new Promise<CloudinaryResponse | any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            { width: 500, crop: 'scale' },
            { quality: 35 },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadMultipleFilesToFolder(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<CloudinaryResponse[]> {
    return Promise.all(
      files.map((file) => this.uploadFileToFolder(file, folder)),
    );
  }

  deleteImageByUrl(url: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      // Trích xuất publicId chính xác hơn bằng cách loại bỏ phần tiền tố của URL trước 'upload/'
      const publicId = url.split('/').slice(-3).join('/').split('.')[0];

      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Error deleting image:', error);
          return reject(error);
        }
        console.log('Deleted image result:', result);
        resolve(result);
      });
    });
  }

  deleteMultipleImagesByUrl(urls: string[] | any): Promise<CloudinaryResponse[]> {
    console.log('Deleting images with URLs:', urls);
    return Promise.all(urls.map((url) => this.deleteImageByUrl(url)));
  }
}
