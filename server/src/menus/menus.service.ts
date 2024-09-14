import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';

@Injectable()
export class MenusService {
  constructor(private prismaService: PrismaService) {}

  // ! Create Menu
  async create(createMenuDto: CreateMenuDto) {
    try {
      const { name, description, foods, price, is_show } = createMenuDto;
      const slug = MakeSlugger(name);

      const findName = await this.prismaService.menus.findFirst({
        where: {
          name,
        },
      });

      if (findName) {
        throw new HttpException('Tên menu đã tồn tại', HttpStatus.BAD_REQUEST);
      }

      const findFoods = await this.prismaService.foods.findMany({
        where: {
          id: {
            in: foods,
          },
        },
      });

      if (findFoods.length !== foods.length) {
        throw new HttpException(
          'Có món ăn không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const connectFoods = foods.map((foodId) => ({
        id: Number(foodId),
      }));

      const menus = await this.prismaService.menus.create({
        data: {
          name,
          description,
          price: Number(price),
          slug,
          is_show,
          foods: {
            connect: connectFoods,
          },
        },
      });

      throw new HttpException(
        { message: 'Tạo menu thành công', data: menus },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get All Menu
  async findAll(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;
    const priceSort = query.priceSort.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 999999999999;

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
      created_at: {
        gte: startDate,
        lte: endDate,
      },
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

    // Sắp xếp theo giá
    let orderByConditions: any = {};
    if (priceSort === 'asc' || priceSort === 'desc') {
      orderByConditions.price = priceSort;
    }

    try {
      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.menus.findMany({
          where: whereConditions,
          include: {
            foods: {
              include: {
                tags: true,
              },
            },
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            ...orderByConditions,
            created_at: 'desc',
          },
        }),
        this.prismaService.menus.count({
          where: whereConditions,
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
      console.log('Lỗi từ menus.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get All Menu Deleted
  async findAllDeleted(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;
    const priceSort = query.priceSort.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 999999999999;

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
      created_at: {
        gte: startDate,
        lte: endDate,
      },
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

    // Sắp xếp theo giá
    let orderByConditions: any = {};
    if (priceSort === 'asc' || priceSort === 'desc') {
      orderByConditions.price = priceSort;
    }

    try {
      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.menus.findMany({
          where: whereConditions,
          include: {
            foods: {
              include: {
                tags: true,
              },
            },
          },
          skip,
          take: itemsPerPage,
          orderBy: {
            ...orderByConditions,
            created_at: 'desc',
          },
        }),
        this.prismaService.menus.count({
          where: whereConditions,
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
      console.log('Lỗi từ menus.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get Menu By Id
  async findOne(id: number) {
    try {
      const menu = await this.prismaService.menus.findUnique({
        where: { id: Number(id) },
        include: {
          foods: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!menu) {
        throw new HttpException('Menu không tồn tại', HttpStatus.NOT_FOUND);
      }

      throw new HttpException({ data: menu }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Get Menu By Slug
  async findBySlug(slug: string) {
    try {
      const menu = await this.prismaService.menus.findFirst({
        where: {
          slug,
        },
        include: {
          foods: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!menu) {
        throw new HttpException('Menu không tồn tại', HttpStatus.NOT_FOUND);
      }

      throw new HttpException({ data: menu }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> findBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Update Menu
  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const { name, description, foods, price } = updateMenuDto;
    try {
      const slug = MakeSlugger(name);
      const findMenuByname = await this.prismaService.menus.findFirst({
        where: {
          name,
          id: {
            not: Number(id),
          },
        },
      });

      if (findMenuByname) {
        throw new HttpException('Tên menu đã tồn tại', HttpStatus.BAD_REQUEST);
      }

      const connectFoods = foods.map((foodId) => ({
        id: foodId,
      }));

      const menu = await this.prismaService.menus.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          price,
          slug,
          foods: {
            set: connectFoods,
          },
        },
      });

      throw new HttpException(
        { message: 'Cập nhật menu thành công', data: menu },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Soft Delete Menu
  async remove(reqUser, id: number) {
    try {
      const findMenu = await this.prismaService.menus.findUnique({
        where: { id: Number(id) },
      });
      if (!findMenu) {
        throw new HttpException('Menu không tồn tại', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.menus.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_by: reqUser.id,
          deleted_at: new Date(),
        },
      });

      throw new HttpException('Xóa menu thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> remove', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Restore Menu
  async restore(id: number) {
    try {
      const findMenu = await this.prismaService.menus.findUnique({
        where: { id: Number(id) },
      });
      if (!findMenu) {
        throw new HttpException('Menu không tồn tại', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.menus.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_by: null,
          deleted_at: null,
        },
      });

      throw new HttpException('Khôi phục menu thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> restore', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }

  // ! Hard Delete Menu
  async destroy(id: number) {
    try {
      const findMenu = await this.prismaService.menus.findUnique({
        where: { id: Number(id) },
      });
      if (!findMenu) {
        throw new HttpException('Menu không tồn tại', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.menus.delete({
        where: { id: Number(id) },
      });

      throw new HttpException('Xóa vĩnh viễn menu thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> destroy', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
      );
    }
  }
}
