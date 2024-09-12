import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFunitureDto, ImageFunitureDto } from './dto/create-funiture.dto';
import { UpdateFunitureDto } from './dto/update-funiture.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { FilterFunitureDto } from './dto/filter-funiture.dto';

@Injectable()
export class FunituresService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create funiture
  async create(
    createFunitureDto: CreateFunitureDto,
    files: { images: ImageFunitureDto },
  ) {
    try {
      const { name, description, short_description, price, type } =
        createFunitureDto;
      if (!files.images) {
        throw new HttpException(
          'Hình ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      const findFunitureByName = await this.prismaService.funitures.findFirst({
        where: {
          name,
        },
      });

      if (findFunitureByName) {
        throw new HttpException(
          'Tên nội thất đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      const slug = MakeSlugger(name);
      const data: any = {
        name,
        slug,
        description,
        short_description,
        type,
        price: Number(price),
      };

      const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
        files.images as any,
        'joieplace/funitures',
      );
      data.images = images;

      const createFuniture = await this.prismaService.funitures.create({
        data,
      });

      throw new HttpException(
        { message: 'Tạo nội thất thành công', data: createFuniture },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all funitures
  async findAll(query: FilterFunitureDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const type = query.type || '';
      const minPrice = Number(query.minPrice) || 0;
      const maxPrice = Number(query.maxPrice) || 0;
      const skip = (page - 1) * itemsPerPage;

      const whereConditions: any = {
        deleted: false,
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            short_description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            type: {
              contains: type,
              mode: 'insensitive',
            },
          },
        ],
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.funitures.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.funitures.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 <= 0 ? null : page - 1;

      throw new HttpException(
        {
          data: res,
          pagination: {
            total,
            currentPage: page,
            lastPage,
            nextPage,
            prevPage,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all funitures by Deleted
  async findAllDeleted(query: FilterFunitureDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const type = query.type || '';
      const minPrice = Number(query.minPrice) || 0;
      const maxPrice = Number(query.maxPrice) || 0;
      const skip = (page - 1) * itemsPerPage;

      const whereConditions: any = {
        deleted: true,
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            short_description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            type: {
              contains: type,
              mode: 'insensitive',
            },
          },
        ],
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.funitures.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.funitures.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 <= 0 ? null : page - 1;

      throw new HttpException(
        {
          data: res,
          pagination: {
            total,
            currentPage: page,
            lastPage,
            nextPage,
            prevPage,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get funiture by ID
  async findOne(id: number) {
    try {
      const funiture = await this.prismaService.funitures.findUnique({
        where: {
          id,
        },
      });

      if (!funiture) {
        throw new HttpException('Nội thất không tồn tại', HttpStatus.NOT_FOUND);
      }

      throw new HttpException({ data: funiture }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get funiture by Slug
  async findOneBySlug(slug: string) {
    try {
      const funiture = await this.prismaService.funitures.findUnique({
        where: {
          slug,
        },
      });

      if (!funiture) {
        throw new HttpException('Nội thất không tồn tại', HttpStatus.NOT_FOUND);
      }

      throw new HttpException({ data: funiture }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> findOneBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Update funiture
  async update(
    id: number,
    updateFunitureDto: UpdateFunitureDto,
    files: { images: ImageFunitureDto },
  ) {
    try {
      const { name, description, short_description, price, type } =
        updateFunitureDto;

      const findFuniture = await this.prismaService.funitures.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findFuniture) {
        throw new HttpException('Nội thất không tồn tại', HttpStatus.NOT_FOUND);
      }

      const findFunitureByName = await this.prismaService.funitures.findFirst({
        where: {
          name,
          NOT: {
            id,
          },
        },
      });

      if (findFunitureByName) {
        throw new HttpException(
          'Tên nội thất đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const slug = MakeSlugger(name);
      const data: any = {
        name,
        slug,
        description,
        short_description,
        type,
        price: Number(price),
      };

      if (files.images) {
        const images = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images as any,
          'joieplace/funitures',
        );
        if (!images) {
          throw new HttpException(
            'Upload ảnh thất bại',
            HttpStatus.BAD_REQUEST,
          );
        }
        // ? Xóa hình ảnh cũ
        await this.cloudinaryService.deleteMultipleImagesByUrl(
          findFuniture.images,
        );
        data.images = images;
      }

      const updateFuniture = await this.prismaService.funitures.update({
        where: {
          id: Number(id),
        },
        data,
      });

      throw new HttpException(
        { message: 'Cập nhật nội thất thành công', data: updateFuniture },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Soft delete funiture
  async delete(reqUser, id: number) {
    try {
      const findFuniture = await this.prismaService.funitures.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findFuniture) {
        throw new HttpException('Nội thất không tồn tại', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.funitures.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted: true,
          deleted_at: new Date(),
          deleted_by: reqUser.id,
        },
      });

      throw new HttpException('Xóa nội thất thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> delete', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Restore funiture
  async restore(id: number) {
    try {
      const findFuniture = await this.prismaService.funitures.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findFuniture) {
        throw new HttpException('Nội thất không tồn tại', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.funitures.update({
        where: {
          id: Number(id),
        },
        data: {
          deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      });

      throw new HttpException('Khôi phục nội thất thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> restore', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Hard delete funiture
  async destroy(id: number) {
    try {
      const findFuniture = await this.prismaService.funitures.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!findFuniture) {
        throw new HttpException('Nội thất không tồn tại', HttpStatus.NOT_FOUND);
      }

      // ? Xóa hình ảnh
      await this.cloudinaryService.deleteMultipleImagesByUrl(
        findFuniture.images,
      );

      await this.prismaService.funitures.delete({
        where: {
          id: Number(id),
        },
      });

      throw new HttpException(
        'Xóa vĩnh viễn nội thất thành công',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ funitures.service.ts -> destroy', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }
}
