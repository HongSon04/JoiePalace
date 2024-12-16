import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { FormatReturnData } from 'helper/FormatReturnData';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { CreateDecorDto, ImageDecorDto } from './dto/create-decor.dto';
import { UpdateDecorDto } from './dto/update-decor.dto';

@Injectable()
export class DecorsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  // ! Create Decor
  async create(createDecorDto: CreateDecorDto, files: ImageDecorDto | any) {
    const { name, price, description, short_description, products } =
      createDecorDto;

    try {
      // Kiểm tra hình ảnh
      if (!files.images) {
        throw new BadRequestException('Hình ảnh không được để trống');
      }

      // Kiểm tra tên trang trí
      const existingDecor = await this.prismaService.decors.findFirst({
        where: { name },
      });
      if (existingDecor) {
        throw new BadRequestException('Tên trang trí đã tồn tại');
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

      if (Number(totalPrice) < Number(price)) {
        throw new BadRequestException('Giá trang trí không hợp lệ');
      }

      // Tải hình ảnh lên Cloudinary
      const imagesDecor =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/decors',
        );
      if (imagesDecor.length === 0) {
        throw new BadRequestException('Upload hình ảnh thất bại');
      }

      // Tạo trang trí
      const createDecor = await this.prismaService.decors.create({
        data: {
          name,
          price: Number(totalPrice),
          description,
          short_description,
          images: imagesDecor as any,
          products: {
            connect: productsTagSet,
          },
        },
        include: {
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      throw new HttpException(
        {
          message: 'Tạo trang trí thành công',
          data: FormatReturnData(createDecor, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> create', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get All Decors
  async findAll(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 0;

    const priceSort = query?.priceSort?.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

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
          foods: {
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
          include: {
            products: {
              include: {
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
        total,
      };

      throw new HttpException(
        {
          data: FormatReturnData(res, []),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> findAll', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get All Deleted Decors
  async findAllDeleted(query: FilterPriceDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 0;

    const priceSort = query?.priceSort?.toLowerCase();

    const startDate = query.startDate
      ? FormatDateToStartOfDay(query.startDate)
      : null;
    const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : null;

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
          foods: {
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
          include: {
            products: {
              include: {
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
        total,
      };

      throw new HttpException(
        {
          data: FormatReturnData(res, []),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> findAllDeleted', error);
      throw new BadRequestException({
        message: error.message || 'Lấy danh sách trang trí thất bại',
      });
    }
  }

  // ! Get One Decor
  async findOne(id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
        include: {
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!decor) {
        throw new NotFoundException('Không tìm thấy trang trí');
      }

      throw new HttpException(
        {
          message: 'Lấy thông tin trang trí thành công',
          data: FormatReturnData(decor, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> findOne', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update Decor
  async update(
    id: number,
    updateDecorDto: UpdateDecorDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { name, price, description, short_description, products } =
        updateDecorDto;

      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });
      if (!decor) {
        throw new NotFoundException('Không tìm thấy trang trí');
      }

      const findDecorByName = await this.prismaService.decors.findFirst({
        where: { AND: [{ name }, { id: { not: Number(id) } }] },
      });

      if (findDecorByName) {
        throw new BadRequestException('Tên trang trí đã tồn tại');
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

      if (Number(totalPrice) < Number(price)) {
        throw new BadRequestException('Giá trang trí không hợp lệ');
      }

      const dataToUpdate: any = {
        name,
        price: Number(price),
        description,
        short_description,
        products: {
          set: productsTagSet,
        },
      };

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

      const updatedDecor = await this.prismaService.decors.update({
        where: { id: Number(id) },
        data: {
          images: [...(uploadImages || []), ...(decor.images || [])],
          ...dataToUpdate,
        },
        include: {
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật trang trí thành công',
          data: FormatReturnData(updatedDecor, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ decors.service.ts -> update', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Soft Delete Decor
  async delete(reqUser, id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });

      if (!decor) {
        throw new NotFoundException('Không tìm thấy trang trí');
      }

      if (decor.deleted) {
        throw new BadRequestException('Trang trí đã bị xóa');
      }

      await this.prismaService.decors.update({
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Restore Decor
  async restore(id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });

      if (!decor) {
        throw new NotFoundException('Không tìm thấy trang trí');
      }

      if (!decor.deleted) {
        throw new BadRequestException(
          'Trang trí chưa bị xóa tạm thời, không thể khôi phục!',
        );
      }

      await this.prismaService.decors.update({
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Hard Delete Decor
  async destroy(id: number) {
    try {
      const decor = await this.prismaService.decors.findUnique({
        where: { id: Number(id) },
      });

      if (!decor) {
        throw new NotFoundException('Không tìm thấy trang trí');
      }

      if (!decor.deleted) {
        throw new BadRequestException(
          'Trang trí chưa bị xóa tạm thời, không thể xóa vĩnh viễn!',
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
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
