import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { updateSpaceDto } from './dto/update-space.dto';
import { DeleteImageDto } from './dto/upload-image.dto';

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
    const { location_id } = body;
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
        images: spcaceImages as any,
        location_id: Number(location_id),
      },
    });
    throw new HttpException(
      { message: 'Tạo không gian thành công', data: spaces },
      HttpStatus.OK,
    );
  }

  async generateSpace(body: CreateSpaceDto): Promise<string> {
    const { images, location_id, description, name } = body;
    const spaces = await this.prismaService.spaces.create({
      data: {
        images: images as any,
        location_id: Number(location_id),
        description,
        name,
      },
    });
    return spaces as any;
  }

  async updateSpace(space_id: number, body: updateSpaceDto): Promise<string> {
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
  }

  async uploadImages(
    id: number,
    files: Express.Multer.File[],
  ): Promise<string> {
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
  }

  async deleteImages(id: number, body: DeleteImageDto): Promise<string> {
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
  }

  async deleteSpace(id: number): Promise<string> {
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
  }
}
