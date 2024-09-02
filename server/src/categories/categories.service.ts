import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name, description, short_description } = createCategoryDto;
      const slug = MakeSlugger(name);
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
      throw new HttpException(
        { message: 'Tạo danh mục thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.categories.findMany({
          where: {
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
          },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.categories.count({
          where: {
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
          },
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page >= lastPage ? null : page + 1;
      const prevPage = page <= 1 ? null : page - 1;

      throw new HttpException(
        {
          data: res,
          pagination: {
            total,
            itemsPerPage,
            lastPage,
            nextPage,
            prevPage,
            currentPage: page,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Lấy danh sách danh mục thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllDeleted(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.categories.findMany({
          where: {
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
          },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.categories.count({
          where: {
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
          },
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page >= lastPage ? null : page + 1;
      const prevPage = page <= 1 ? null : page - 1;

      throw new HttpException(
        {
          data: res,
          pagination: {
            total,
            itemsPerPage,
            lastPage,
            nextPage,
            prevPage,
            currentPage: page,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Lấy danh sách danh mục đã xóa thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findOne(id: number) {
    try {
      const category = this.prismaService.categories.findUnique({
        where: {
          id,
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
      throw new HttpException(
        { message: 'Lấy thông tin danh mục thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findOneBySlug(slug: string) {
    try {
      const category = this.prismaService.categories.findUnique({
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
      throw new HttpException(
        { message: 'Lấy thông tin danh mục thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const findCategories = this.prismaService.categories.findUnique({
        where: {
          id,
        },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      const { name, description, short_description } = updateCategoryDto;
      const slug = MakeSlugger(name);
      const categories = this.prismaService.categories.update({
        where: {
          id,
        },
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
      throw new HttpException(
        { message: 'Cập nhật danh mục thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  softDelete(reqUser, id: number) {
    try {
      const findCategories = this.prismaService.categories.findUnique({
        where: {
          id,
        },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      const categories = this.prismaService.categories.update({
        where: {
          id,
        },
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
      throw new HttpException(
        { message: 'Xóa danh mục thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async restore(id: number) {
    try {
      const findCategories = this.prismaService.categories.findUnique({
        where: {
          id,
        },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      const categories = this.prismaService.categories.update({
        where: {
          id,
        },
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
      throw new HttpException(
        { message: 'Khôi phục danh mục thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async destroy(id: number) {
    try {
      const findCategories = this.prismaService.categories.findUnique({
        where: {
          id,
        },
      });
      if (!findCategories) {
        throw new HttpException(
          { message: 'Không tìm thấy danh mục' },
          HttpStatus.NOT_FOUND,
        );
      }
      const categories = this.prismaService.categories.delete({
        where: {
          id,
        },
      });
      throw new HttpException(
        { message: 'Xóa danh mục vĩnh viễn thành công', data: categories },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        { message: 'Xóa danh mục vĩnh viễn thất bại', error },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
