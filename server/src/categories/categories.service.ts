import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  // ! Create Categories
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name, description, short_description } = createCategoryDto;
      const slug = MakeSlugger(name);
      // ? Check Name and Slug
      const findCategories = await this.prismaService.categories.findFirst({
        where: {
          OR: [
            {
              name,
            },
            {
              slug,
            },
          ],
        },
      });
      if (findCategories) {
        throw new HttpException(
          { message: 'Tên danh mục đã tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      // ? Create Categories
      const categories = await this.prismaService.categories.create({
        data: {
          name,
          slug,
          description,
          short_description,
        },
      });
      throw new HttpException(
        { message: 'Tạo danh mục thành công', data: categories },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get All Categories
  async findAll(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};

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
        ],
        ...sortRangeDate,
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.categories.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.categories.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
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
      console.log('Lỗi từ categories.service.ts -> ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get All Deleted Categories
  async findAllDeleted(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};

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
        ],
        ...sortRangeDate,
      };

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.categories.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.categories.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
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
      console.log('Lỗi từ categories.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get One Category
  async findOne(id: number) {
    try {
      const category = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!category) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException({ data: category }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get One Category By Slug
  async findOneBySlug(slug: string) {
    try {
      const category = await this.prismaService.categories.findUnique({
        where: {
          slug,
        },
      });
      if (!category) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException({ data: category }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> findOneBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Update Categories
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }

      const { name, description, short_description } = updateCategoryDto;
      const slug = MakeSlugger(name);
      // ? Check Name and Slug
      const findCategoriesByName =
        await this.prismaService.categories.findFirst({
          where: {
            name,
            NOT: {
              id: Number(id),
            },
          },
        });
      if (findCategoriesByName) {
        throw new HttpException(
          { message: 'Tên danh mục đã tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      // ? Update Categories
      const categories = await this.prismaService.categories.update({
        where: { id: Number(id) },
        data: {
          name,
          slug,
          description,
          short_description,
        },
      });

      throw new HttpException(
        { message: 'Cập nhật danh mục thành công', data: categories },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Soft Delete Categories
  async softDelete(reqUser, id: number) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      // ? Soft Delete Categories
      const categories = await this.prismaService.categories.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_by: reqUser.id,
          deleted_at: new Date(),
        },
      });
      throw new HttpException(
        { message: 'Xóa danh mục thành công', data: categories },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> softDelete', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Restore Categories
  async restore(id: number) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      // ? Restore Categories
      const categories = await this.prismaService.categories.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_by: null,
          deleted_at: null,
        },
      });
      throw new HttpException(
        { message: 'Khôi phục danh mục thành công', data: categories },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> restore', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Destroy Categories
  async destroy(id: number) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      // ? Destroy Categories
      const categories = await this.prismaService.categories.delete({
        where: { id: Number(id) },
      });
      throw new HttpException(
        { message: 'Xóa danh mục vĩnh viễn thành công', data: categories },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> destroy', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }
}
