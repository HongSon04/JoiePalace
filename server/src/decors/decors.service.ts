import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDecorDto, ImageDecorDto } from './dto/create-decor.dto';
import { UpdateDecorDto } from './dto/update-decor.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';

@Injectable()
export class DecorsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  // ! Create Decor
  async create(createDecorDto: CreateDecorDto, files: ImageDecorDto | any) {
    const { name, price, description, short_description } = createDecorDto;
    const slug = MakeSlugger(name);
    try {
      if (!files.images) {
        throw new HttpException(
          'Hình ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      const findDecorByName = await this.prismaService.decors.findFirst({
        where: { name },
      });

      if (findDecorByName) {
        throw new HttpException(
          'Tên trang trí đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const imagesDecor =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joieplace/decors',
        );

      if (imagesDecor.length === 0) {
        throw new HttpException(
          'Upload hình ảnh thất bại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createDecor = await this.prismaService.decors.create({
        data: {
          name,
          slug,
          price: Number(price),
          description,
          short_description,
          images: imagesDecor as any,
        },
      });

      throw new HttpException(
        { message: 'Tạo trang trí thành công', data: createDecor },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get All Decors
  async findAll(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 999999999999;

    const priceSort = query.priceSort.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

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
          foods: {
            some: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    };

    if (minPrice >= 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      ];
    }

    // Điều kiện ngày tạo
    if (startDate && endDate) {
      if (!whereConditions.AND) whereConditions.AND = [];
      whereConditions.AND.push({
        created_at: { gte: startDate, lte: endDate },
      });
    }

    // Sắp xếp theo giá
    let orderByConditions: any = {};
    if (priceSort === 'asc' || priceSort === 'desc') {
      orderByConditions.price = priceSort;
    }

    try {
      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.decors.findMany({
          where: whereConditions,

          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.decors.count({
          where: whereConditions,
        }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
      };

      throw new HttpException(
        {
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get All Deleted Decors
  async findAllDeleted(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 999999999999;

    const priceSort = query.priceSort.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

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
          foods: {
            some: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    };

    if (minPrice >= 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      ];
    }

    // Điều kiện ngày tạo
    if (startDate && endDate) {
      if (!whereConditions.AND) whereConditions.AND = [];
      whereConditions.AND.push({
        created_at: { gte: startDate, lte: endDate },
      });
    }

    // Sắp xếp theo giá
    let orderByConditions: any = {};
    if (priceSort === 'asc' || priceSort === 'desc') {
      orderByConditions.price = priceSort;
    }

    try {
      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.decors.findMany({
          where: whereConditions,

          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.decors.count({
          where: whereConditions,
        }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
      };

      throw new HttpException(
        {
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> findAllDeleted', error);
      throw new HttpException(
        { message: error.message || 'Lấy danh sách trang trí thất bại' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ! Get One Decor
  async findOne(id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });

      if (!decor) {
        throw new HttpException(
          'Không tìm thấy trang trí',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(decor, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get One Decor By Slug
  async findOneBySlug(slug: string) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { slug },
      });

      if (!decor) {
        throw new HttpException(
          'Không tìm thấy trang trí',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(decor, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> findOneBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Update Decor
  async update(
    id: number,
    updateDecorDto: UpdateDecorDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { name, price, description, short_description } = updateDecorDto;

      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });
      if (!decor) {
        throw new HttpException(
          'Không tìm thấy trang trí',
          HttpStatus.BAD_REQUEST,
        );
      }

      const slug = MakeSlugger(name);
      const findDecorByName = await this.prismaService.decors.findFirst({
        where: { name, NOT: { id: Number(id) } },
      });

      if (findDecorByName) {
        throw new HttpException(
          'Tên trang trí đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }
      const dataToUpdate: any = {
        name,
        slug,
        price: Number(price),
        description,
        short_description,
      };

      if (files.images) {
        const imagesDecor =
          await this.cloudinaryService.uploadMultipleFilesToFolder(
            files.images,
            'joieplace/decors',
          );

        if (!imagesDecor.length) {
          throw new HttpException(
            'Upload hình ảnh thất bại',
            HttpStatus.BAD_REQUEST,
          );
        }
        // Delete old images
        await this.cloudinaryService.deleteMultipleImagesByUrl(decor.images);
        dataToUpdate.images = imagesDecor;
      }

      const updatedDecor = await this.prismaService.decors.update({
        where: { id: Number(id) },
        data: dataToUpdate,
      });

      throw new HttpException(
        { message: 'Cập nhật trang trí thành công', data: updatedDecor },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Soft Delete Decor
  async delete(reqUser, id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });

      if (!decor) {
        throw new HttpException(
          'Không tìm thấy trang trí',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (decor.deleted) {
        throw new HttpException('Trang trí đã bị xóa', HttpStatus.BAD_REQUEST);
      }

      const updatedDecor = await this.prismaService.decors.update({
        where: { id: Number(id) },
        data: { deleted: true, deleted_by: reqUser.id, deleted_at: new Date() },
      });

      throw new HttpException(
        { message: 'Xóa trang trí thành công' },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> delete', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Restore Decor
  async restore(id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });

      if (!decor) {
        throw new HttpException(
          'Không tìm thấy trang trí',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!decor.deleted) {
        throw new HttpException(
          'Trang trí chưa bị xóa',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedDecor = await this.prismaService.decors.update({
        where: { id: Number(id) },
        data: { deleted: false, deleted_by: null, deleted_at: null },
      });

      throw new HttpException(
        { message: 'Khôi phục trang trí thành công' },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> restore', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Hard Delete Decor
  async destroy(id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });

      if (!decor) {
        throw new HttpException(
          'Không tìm thấy trang trí',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!decor.deleted) {
        throw new HttpException(
          'Trang trí chưa bị xóa',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Delete images
      await this.cloudinaryService.deleteMultipleImagesByUrl(decor.images);

      await this.prismaService.decors.delete({
        where: { id: Number(id) },
      });

      throw new HttpException(
        { message: 'Xóa trang trí vĩnh viễn thành công' },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> destroy', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }
}
