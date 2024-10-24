import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { FormatReturnData } from 'helper/FormatReturnData';

@Injectable()
export class MenusService {
  constructor(private prismaService: PrismaService) {}

  // ! Create Menu
  async create(createMenuDto: CreateMenuDto) {
    try {
      const { name, description, products, price, is_show } = createMenuDto;
      const slug = MakeSlugger(name);

      const findName = await this.prismaService.menus.findFirst({
        where: {
          name,
        },
      });

      if (findName) {
        throw new BadRequestException('Tên menu đã tồn tại');
      }

      const findProducts = await this.prismaService.products.findMany({
        where: {
          id: {
            in: products,
          },
        },
      });

      if (findProducts.length !== products.length) {
        throw new NotFoundException('Có món ăn không tồn tại');
      }

      const connectproducts = products.map((foodId) => ({
        id: Number(foodId),
      }));

      // Check Food Price (Total Amount) equal with price of menu
      const totalAmount = findProducts.reduce(
        (acc, curr) => acc + curr.price,
        0,
      );
      if (totalAmount !== Number(price)) {
        throw new BadRequestException(
          'Giá của menu không trùng với tổng giá của các món ăn',
        );
      }

      const menus = await this.prismaService.menus.create({
        data: {
          name,
          description,
          price: Number(price),
          slug,
          is_show,
          products: {
            connect: connectproducts,
          },
        },
      });

      throw new HttpException(
        { message: 'Tạo menu thành công', data: FormatReturnData(menus, []) },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get All Menu
  async findAll(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;
    const priceSort = query?.priceSort?.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 0;

    // ? Range Date Conditions
    const sortRangeDate: any =
      startDate && endDate
        ? {
            created_at: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {};

    // ? Where Conditions
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
          products: {
            some: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],

      ...sortRangeDate,
    };

    if (minPrice >= 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
            gte: minPrice,
          },
        },
      ];
    }

    if (maxPrice > 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
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
            products: {
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
          data: FormatReturnData(res, []),
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
        error,
      );
    }
  }

  // ! Get All Menu Deleted
  async findAllDeleted(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;
    const priceSort = query?.priceSort?.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 0;

    // ? Range Date Conditions
    const sortRangeDate: any =
      startDate && endDate
        ? {
            created_at: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {};

    // ? Where Conditions
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
          products: {
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
          },
        },
      ];
    }

    if (maxPrice > 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
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
            products: {
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
          data: FormatReturnData(res, []),
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
        error,
      );
    }
  }

  // ! Get Menu By Id
  async findOne(id: number) {
    try {
      const menu = await this.prismaService.menus.findUnique({
        where: { id: Number(id) },
        include: {
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!menu) {
        throw new NotFoundException('Menu không tồn tại');
      }

      throw new HttpException(
        { data: FormatReturnData(menu, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!menu) {
        throw new NotFoundException('Menu không tồn tại');
      }

      throw new HttpException(
        { data: FormatReturnData(menu, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> findBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Update Menu
  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const { name, description, products, price } = updateMenuDto;
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
        throw new BadRequestException('Tên menu đã tồn tại');
      }

      const findProducts = await this.prismaService.products.findMany({
        where: {
          id: {
            in: products,
          },
        },
      });

      if (findProducts.length !== products.length) {
        throw new NotFoundException('Có món ăn không tồn tại');
      }

      const connectproducts = products.map((foodId) => ({
        id: foodId,
      }));

      // Check Food Price (Total Amount) equal with price of menu
      const totalAmount = findProducts.reduce(
        (acc, curr) => acc + curr.price,
        0,
      );
      if (totalAmount !== Number(price)) {
        throw new BadRequestException(
          'Giá của menu không trùng với tổng giá của các món ăn',
        );
      }

      const menu = await this.prismaService.menus.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          price,
          slug,
          products: {
            set: connectproducts,
          },
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật menu thành công',
          data: FormatReturnData(menu, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
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
        throw new NotFoundException('Menu không tồn tại');
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
        error,
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
        throw new NotFoundException('Menu không tồn tại');
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
        error,
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
        throw new NotFoundException('Menu không tồn tại');
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
        error,
      );
    }
  }
}
