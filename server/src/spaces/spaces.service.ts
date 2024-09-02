import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { updateSpaceDto } from './dto/update-space.dto';
import { DeleteImageDto } from './dto/upload-image.dto';
import { MakeSlugger } from 'helper/slug';

@Injectable()
export class SpacesService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private prismaService: PrismaService,
  ) {}

  async createSpace(
    body: CreateSpaceDto,
    files: { images?: Express.Multer.File[] },
  ): Promise<string> {
    try {
      const { location_id } = body;
      const slug = MakeSlugger(body.name);
      const spcaceImages = {};
      if (files.images) {
        const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joieplace/space',
        );
        spcaceImages['images'] = images;
      } else {
        throw new HttpException(
          'Ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }
      const spaces = await this.prismaService.spaces.create({
        data: {
          ...body,
          slug,
          images: spcaceImages as any,
          location_id: Number(location_id),
        },
      });
      throw new HttpException(
        { message: 'Tạo không gian thành công', data: spaces },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  async findSpacesByLocation(location_id: number): Promise<string> {
    try {
      const spaces = await this.prismaService.spaces.findMany({
        where: { location_id: Number(location_id) },
      });
      throw new HttpException({ data: spaces }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  async updateSpace(space_id: number, body: updateSpaceDto): Promise<string> {
    try {
      const { description, name } = body;
      const spaces = await this.prismaService.spaces.update({
        where: { id: Number(space_id) },
        data: {
          description,
          name,
        },
      });
      throw new HttpException(
        { message: 'Cập nhật không gian thành công', data: spaces },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  async findSpaceById(space_id: number): Promise<string> {
    try {
      const space = await this.prismaService.spaces.findUnique({
        where: { id: Number(space_id) },
      });
      throw new HttpException({ data: space }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  async findSpaceBySlug(slug: string): Promise<string> {
    try {
      const space = await this.prismaService.spaces.findUnique({
        where: { slug },
      });
      throw new HttpException({ data: space }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  async uploadImages(
    id: number,
    files: Express.Multer.File[],
  ): Promise<string> {
    try {
      const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
        files,
        'joieplace/space',
      );
      const findSpace = await this.prismaService.spaces.findUnique({
        where: { id },
      });
      if (!findSpace) {
        throw new HttpException(
          'Không tìm thấy không gian',
          HttpStatus.NOT_FOUND,
        );
      }
      // ? Spread old images and new images
      const newImages = [...findSpace.images, ...images];
      // ? Update space images
      const space = await this.prismaService.spaces.update({
        where: { id },
        data: {
          images: newImages as any,
        },
      });
      throw new HttpException(
        { message: 'Cập nhật ảnh không gian thành công', data: space },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  async deleteImages(id: number, body: DeleteImageDto): Promise<string> {
    try {
      const { image_url } = body;
      const findSpace = await this.prismaService.spaces.findUnique({
        where: { id },
      });
      if (!findSpace) {
        throw new HttpException(
          'Không tìm thấy không gian',
          HttpStatus.NOT_FOUND,
        );
      }
      // ? Filter images
      const newImages = findSpace.images.filter((image) => image !== image_url);
      // ? Update space images
      const space = await this.prismaService.spaces.update({
        where: { id },
        data: {
          images: newImages as any,
        },
      });
      // Delete images from cloudinary
      await this.cloudinaryService.deleteMultipleImagesByUrl(image_url);
      throw new HttpException(
        { message: 'Xóa ảnh không gian thành công', data: space },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  async deleteSpace(id: number): Promise<string> {
    try {
      const findSpace = await this.prismaService.spaces.findUnique({
        where: { id },
      });
      if (!findSpace) {
        throw new HttpException(
          'Không tìm thấy không gian',
          HttpStatus.NOT_FOUND,
        );
      }
      // ? Delete images from cloudinary
      await this.cloudinaryService.deleteMultipleImagesByUrl(findSpace.images);
      // ? Delete space
      await this.prismaService.spaces.delete({ where: { id } });
      throw new HttpException('Xóa không gian thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }
}
