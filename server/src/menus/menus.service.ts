import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { FormatReturnData } from 'helper/FormatReturnData';
import { MakeSlugger } from 'helper/slug';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { FilterMenuDto } from './dto/FilterMenu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create Menu
  async create(
    reqUser,
    createMenuDto: CreateMenuDto,
    files: { images?: Express.Multer.File[] },
  ) {
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

      // ? Kiểm tra sản phẩm
      let productsTagSet = [];
      let totalPrice = 0;
      // Handle tags if provided
      if (products && products.length > 0) {
        const productsArray = JSON.parse(products as any);
        const existingProducts = await this.prismaService.products.findMany({
          where: { id: { in: productsArray } },
        });

        totalPrice = existingProducts.reduce(
          (total, product) => total + Number(product.price),
          0,
        );

        if (existingProducts.length !== productsArray.length) {
          throw new NotFoundException('Một hoặc nhiều sản phẩm không tồn tại');
        }

        // Set tagsSet if tags exist
        productsTagSet = existingProducts.map((product) => ({
          id: Number(product.id),
        }));
      } else {
        throw new BadRequestException('Menu cần ít nhất 1 sản phẩm');
      }

      if (Number(totalPrice) !== Number(price)) {
        throw new BadRequestException(
          `Giá của menu không trùng với tổng giá của các món ăn, giá thực: ${totalPrice}`,
        );
      }

      // ? Upload Image if available
      const images =
        files?.images && files?.images?.length > 0
          ? await this.cloudinaryService.uploadMultipleFilesToFolder(
              files.images,
              'joiepalace/menu',
            )
          : ([] as any);

      const menus = await this.prismaService.menus.create({
        data: {
          name,
          user_id: Number(reqUser.id),
          description,
          price: Number(price),
          slug,
          is_show: String(is_show) === 'true' ? true : false,
          products: {
            connect: productsTagSet,
          },
          images,
        },
        include: {
          products: {
            include: {
              categories: true,
              tags: true,
            },
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get All Menu
  async findAll(query: FilterMenuDto) {
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
      ...sortRangeDate,
    };

    if (search) {
      whereConditions.OR = [
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
      ];
    }

    if (minPrice >= 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
            gte: Number(minPrice),
          },
        },
      ];
    }

    if (maxPrice > 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
            lte: Number(maxPrice),
          },
        },
      ];
    }

    if (query.user_id) {
      const findUser = await this.prismaService.users.findUnique({
        where: { id: Number(query.user_id) },
      });

      if (!findUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      whereConditions.user_id = Number(query.user_id);
    }

    if (query.is_show) {
      whereConditions.is_show = String(query.is_show) === 'true' ? true : false;
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
                categories: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
                tags: true,
              },
            },
          },
          skip: Number(skip),
          take: itemsPerPage,
          orderBy: {
            ...(orderByConditions ? orderByConditions : { created_at: 'desc' }),
          },
        }),
        this.prismaService.menus.count({
          where: whereConditions,
        }),
      ]);

      res.forEach((menu) => {
        return (menu.products = this.groupProductsByCategory(
          menu.products,
        ) as any);
      });

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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get All Menu Deleted
  async findAllDeleted(query: FilterMenuDto) {
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
      ...sortRangeDate,
    };

    if (search) {
      whereConditions.OR = [
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
      ];
    }

    if (minPrice >= 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
            gte: Number(minPrice),
          },
        },
      ];
    }

    if (maxPrice > 0) {
      whereConditions.AND = [
        ...(whereConditions.AND || []),
        {
          price: {
            lte: Number(maxPrice),
          },
        },
      ];
    }

    if (query.user_id) {
      const findUser = await this.prismaService.users.findUnique({
        where: { id: Number(query.user_id) },
      });

      if (!findUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      whereConditions.user_id = Number(query.user_id);
    }

    if (query.is_show) {
      whereConditions.is_show = String(query.is_show) === 'true' ? true : false;
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
                categories: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
                tags: true,
              },
            },
          },
          skip: Number(skip),
          take: itemsPerPage,
          orderBy: {
            ...(orderByConditions ? orderByConditions : { created_at: 'desc' }),
          },
        }),
        this.prismaService.menus.count({
          where: whereConditions,
        }),
      ]);

      res.forEach((menu) => {
        return (menu.products = this.groupProductsByCategory(
          menu.products,
        ) as any);
      });

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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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
              categories: true,
              tags: true,
            },
          },
        },
      });

      if (!menu) {
        throw new NotFoundException('Menu không tồn tại');
      }

      menu.products = this.groupProductsByCategory(menu.products) as any;

      throw new HttpException(
        { data: FormatReturnData(menu, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> findOne', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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
              categories: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              tags: true,
            },
          },
        },
      });

      if (!menu) {
        throw new NotFoundException('Menu không tồn tại');
      }

      menu.products = this.groupProductsByCategory(menu.products) as any;

      throw new HttpException(
        { data: FormatReturnData(menu, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ menus.service.ts -> findBySlug', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update Menu
  async update(
    id: number,
    updateMenuDto: UpdateMenuDto,
    files: { images?: Express.Multer.File[] },
  ) {
    const { name, description, products, price, is_show } = updateMenuDto;
    try {
      const slug = MakeSlugger(name);
      const findMenuByname = await this.prismaService.menus.findFirst({
        where: { AND: [{ name }, { id: { not: Number(id) } }] },
      });

      if (findMenuByname) {
        throw new BadRequestException('Tên menu đã tồn tại');
      }

      const findMenuById = await this.prismaService.menus.findUnique({
        where: { id: Number(id) },
      });

      if (!findMenuById) {
        throw new NotFoundException('Menu không tồn tại');
      }

      // ? Kiểm tra sản phẩm
      let productsTagSet = [];
      let totalPrice = 0;
      // Handle tags if provided
      if (products && products.length > 0) {
        const productsArray = JSON.parse(products as any);
        const existingProducts = await this.prismaService.products.findMany({
          where: { id: { in: productsArray } },
        });

        totalPrice = existingProducts.reduce(
          (total, product) => total + Number(product.price),
          0,
        );

        if (existingProducts.length !== productsArray.length) {
          throw new NotFoundException('Một hoặc nhiều sản phẩm không tồn tại');
        }

        // Set tagsSet if tags exist
        productsTagSet = existingProducts.map((product) => ({
          id: Number(product.id),
        }));
      } else {
        throw new BadRequestException('Menu cần ít nhất 1 sản phẩm');
      }

      if (Number(totalPrice) !== Number(price)) {
        throw new BadRequestException(
          `Giá của menu không trùng với tổng giá của các món ăn, giá thực: ${totalPrice}`,
        );
      }

      let uploadImages;
      // Upload images
      if (files?.images?.length > 0) {
        uploadImages = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/packages',
        );

        if (!uploadImages) {
          throw new BadRequestException('Upload ảnh thất bại');
        }
      }

      const menu = await this.prismaService.menus.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          price: Number(price),
          slug,
          is_show: String(is_show) === 'true' ? true : false,
          products: {
            set: productsTagSet,
          },
          images: [
            ...(uploadImages || []),
            ...(findMenuById.images || []),
          ],
        },
        include: {
          products: {
            include: {
              categories: true,
              tags: true,
            },
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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

      if (!findMenu.deleted) {
        throw new BadRequestException(
          'Menu chưa bị xóa tạm thời, không thể khôi phục',
        );
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
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

      if (findMenu.deleted === false) {
        throw new BadRequestException(
          'Menu chưa bị xóa tạm thời, không thể xóa vĩnh viễn',
        );
      }

      const relatedBookings = await this.prismaService.booking_details.findMany(
        {
          where: { menu_id: Number(id) },
        },
      );

      if (relatedBookings.length > 0) {
        throw new BadRequestException(
          'Không thể xóa menu vì có booking liên quan.',
        );
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  private groupProductsByCategory(products) {
    const groupedProducts = {};
    products.forEach((product) => {
      const categorySlug = product.categories.slug;
      if (!groupedProducts[categorySlug]) {
        groupedProducts[categorySlug] = [];
      }
      groupedProducts[categorySlug].push(product);
    });

    return groupedProducts;
  }
}
