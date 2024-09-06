import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';

@Injectable()
export class TagsService {
  constructor(private prismaService: PrismaService) {}

  // ! Create tag
  async create(createTagDto: CreateTagDto) {
    try {
      const { name } = createTagDto;

      const findName = await this.prismaService.tags.findFirst({
        where: {
          name,
        },
      });
      if (findName) {
        throw new HttpException(
          { message: 'Tag đã tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const slug = MakeSlugger(name);

      const tags = await this.prismaService.tags.create({
        data: {
          name,
          slug,
        },
      });

      throw new HttpException(
        { message: 'Tạo tag thành công', data: tags },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ tag.service.ts -> create: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ? Get all tags
  async findAll(query: FilterDto): Promise<any> {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.tags.findMany({
          where: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          skip,
          take: itemsPerPage,
        }),
        this.prismaService.tags.count({
          where: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

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
      console.log('Lỗi từ tag.service.ts -> findAll: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ? Get tag by id
  async findOne(id: number) {
    try {
      const tag = await this.prismaService.tags.findUnique({
        where: {
          id,
        },
      });
      if (!tag) {
        throw new HttpException(
          { message: 'Tag không tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException({ data: tag }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ tag.service.ts -> findOne: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ? Get tag by slug
  async findBySlug(slug: string) {
    try {
      const tag = await this.prismaService.tags.findFirst({
        where: {
          slug,
        },
      });
      if (!tag) {
        throw new HttpException(
          { message: 'Tag không tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException({ data: tag }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ tag.service.ts -> findBySlug: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ? Update tag
  async update(id: number, updateTagDto: UpdateTagDto) {
    try {
      const { name } = updateTagDto;
      const slug = MakeSlugger(name);
      const findTag = await this.prismaService.tags.findUnique({
        where: { id: Number(id) },
      });
      if (!findTag) {
        throw new HttpException(
          { message: 'Tag không tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const findTagByName = await this.prismaService.tags.findFirst({
        where: { name, id: { not: Number(id) } },
      });
      if (findTagByName) {
        throw new HttpException(
          { message: 'Tag đã tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const tag = await this.prismaService.tags.update({
        where: { id: Number(id) },
        data: {
          name,
          slug,
        },
      });
      throw new HttpException(
        { message: 'Cập nhật tag thành công', data: tag },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ tag.service.ts -> update: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ? Remove tag
  async remove(id: number) {
    try {
      const findTag = await this.prismaService.tags.findUnique({
        where: { id: Number(id) },
      });
      if (!findTag) {
        throw new HttpException(
          { message: 'Tag không tồn tại' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const tag = await this.prismaService.tags.delete({
        where: { id: Number(id) },
      });
      throw new HttpException(
        { message: 'Xóa tag thành công', data: tag },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ tag.service.ts -> remove: ', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }
}
