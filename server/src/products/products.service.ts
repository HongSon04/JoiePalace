import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { FormatReturnData } from 'helper/FormatReturnData';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create product
  async create(
    createProductDto: CreateProductDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { category_id, name, description, short_description, tags, price } =
        createProductDto;

      // Validate inputs
      if (!files.images || files.images.length === 0) {
        throw new BadRequestException('Ảnh không được để trống');
      }

      // Check product existence
      const existingproduct = await this.prismaService.products.findFirst({
        where: { name },
      });

      if (existingproduct) {
        throw new BadRequestException('Sản phẩm đã tồn tại');
      }

      // Check tags existence
      const tagsArray = JSON.parse(tags as any);
      const existingTags = await this.prismaService.tags.findMany({
        where: { id: { in: tagsArray } },
      });

      if (existingTags.length !== tagsArray.length) {
        throw new NotFoundException('Một hoặc nhiều tag không tồn tại');
      }

      // Check category existence
      const existingCategory = await this.prismaService.categories.findUnique({
        where: { id: Number(category_id) },
      });

      if (!existingCategory) {
        throw new NotFoundException('Danh mục không tồn tại');
      }

      // Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/products',
        );

      if (!uploadImages) {
        throw new BadRequestException('Upload ảnh thất bại');
      }

      // Create product entry
      const slug = MakeSlugger(name);
      const tagsConnect = existingTags.map((tag) => ({ id: Number(tag.id) }));

      const createproduct = await this.prismaService.products.create({
        data: {
          category_id: Number(category_id),
          name,
          slug,
          description,
          short_description,
          price: Number(price),
          images: uploadImages as any,
          tags: {
            connect: tagsConnect,
          },
        },
      });

      throw new HttpException(
        {
          message: 'Tạo Sản phẩm thành công',
          data: FormatReturnData(createproduct, []),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get all products
  async findAll(query: FilterPriceDto) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query?.priceSort?.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(minPrice, Number(query.maxPrice) || 0);

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

      // ? Tạo điều kiện tìm kiếm
      const whereConditions: any = {
        deleted: false,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { short_description: { contains: search, mode: 'insensitive' } },
          { categories: { name: { contains: search, mode: 'insensitive' } } },
          {
            tags: { some: { name: { contains: search, mode: 'insensitive' } } },
          },
        ],
        ...sortRangeDate,
      };

      // Điều kiện giá
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { gte: minPrice } });
      }

      if (maxPrice > 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { lte: maxPrice } });
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

      // Lấy danh sách Sản phẩm và tổng số
      const [products, totalCount] = await Promise.all([
        this.prismaService.products.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.products.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
        total: totalCount,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: FormatReturnData(products, []), pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get all deleted products
  async findAllDeleted(query: FilterPriceDto) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query?.priceSort?.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(minPrice, Number(query.maxPrice) || 0);

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

      // Tạo điều kiện tìm kiếm
      const whereConditions: any = {
        deleted: true,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { short_description: { contains: search, mode: 'insensitive' } },
          { categories: { name: { contains: search, mode: 'insensitive' } } },
          {
            tags: { some: { name: { contains: search, mode: 'insensitive' } } },
          },
        ],
        ...sortRangeDate,
      };

      // Điều kiện giá
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { gte: minPrice } });
      }

      if (maxPrice > 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { lte: maxPrice } });
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

      // Lấy danh sách Sản phẩm và tổng số
      const [products, totalCount] = await Promise.all([
        this.prismaService.products.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.products.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
        total: totalCount,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: FormatReturnData(products, []), pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get all products by category
  async findOne(id: number) {
    try {
      const product = await this.prismaService.products.findFirst({
        where: { id: Number(id) },
        include: {
          categories: true,
          tags: true,
        },
      });
      if (!product) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }
      throw new HttpException(
        {
          data: FormatReturnData(product, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get 10 products per category
  async get10PerCategory() {
    try {
      const categoriesProducts = await this.prismaService.categories.findMany({
        where: { deleted: false },
        include: {
          products: {
            where: { deleted: false },
            take: 10,
            orderBy: { created_at: 'desc' },
          },
        },
      });

      throw new HttpException(
        {
          data: FormatReturnData(categoriesProducts, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> get10PerCategory', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }
  // ! Get all products by slug
  async findBySlug(slug: string) {
    try {
      const product = await this.prismaService.products.findFirst({
        where: { slug },
        include: {
          categories: true,
          tags: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      throw new HttpException(
        {
          data: FormatReturnData(product, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> findBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get all products by category id
  async findByCategoryId(query: FilterPriceDto, category_id: number) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query?.priceSort?.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(minPrice, Number(query.maxPrice) || 0);

      // Tạo điều kiện tìm kiếm
      const whereConditions: any = {
        deleted: false,
        category_id: Number(category_id),
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { short_description: { contains: search, mode: 'insensitive' } },
          { categories: { name: { contains: search, mode: 'insensitive' } } },
          {
            tags: { some: { name: { contains: search, mode: 'insensitive' } } },
          },
        ],
      };

      // Điều kiện giá
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { gte: minPrice } });
      }

      if (maxPrice > 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { lte: maxPrice } });
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

      // ? Check category existence
      const existingCategory = await this.prismaService.categories.findUnique({
        where: { id: Number(category_id) },
      });

      if (!existingCategory) {
        throw new NotFoundException('Danh mục không tồn tại');
      }

      // Lấy danh sách Sản phẩm và tổng số
      const [products, totalCount] = await Promise.all([
        this.prismaService.products.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.products.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
        total: totalCount,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: FormatReturnData(products, []), pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> findByCategoryId', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Get all products by tag id
  async findByTagId(query: FilterPriceDto, tag_id: number) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query?.priceSort?.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(minPrice, Number(query.maxPrice) || 0);

      // Tạo điều kiện tìm kiếm
      const whereConditions: any = {
        deleted: false,
        tags: {
          some: {
            id: tag_id,
          },
        },
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { short_description: { contains: search, mode: 'insensitive' } },
          { categories: { name: { contains: search, mode: 'insensitive' } } },
          {
            tags: { some: { name: { contains: search, mode: 'insensitive' } } },
          },
        ],
      };

      // Điều kiện giá
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { gte: minPrice } });
      }

      if (maxPrice > 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { lte: maxPrice } });
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

      // ? Check tag existence
      const existingTag = await this.prismaService.tags.findUnique({
        where: { id: tag_id },
      });

      if (!existingTag) {
        throw new NotFoundException('Tag không tồn tại');
      }

      // Lấy danh sách Sản phẩm và tổng số
      const [products, totalCount] = await Promise.all([
        this.prismaService.products.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.products.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
        total: totalCount,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: FormatReturnData(products, []), pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> findByTagId', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Update product
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { category_id, name, description, short_description, tags, price } =
        updateProductDto;

      // Check product existence
      const findproduct = await this.prismaService.products.findUnique({
        where: { id: Number(id) },
      });
      if (!findproduct) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      // Check product existence by name
      const findproductByName = await this.prismaService.products.findFirst({
        where: { name, id: { not: id } },
      });
      if (findproductByName) {
        throw new BadRequestException('Tên Sản phẩm đã tồn tại');
      }
      // Handle tags
      const tagsArray = JSON.parse(tags as any);
      const existingTags = await this.prismaService.tags.findMany({
        where: { id: { in: tagsArray } },
      });

      if (existingTags.length !== tagsArray.length) {
        throw new NotFoundException('Một hoặc nhiều tag không tồn tại');
      }

      // Check category existence
      const findCategory = await this.prismaService.categories.findUnique({
        where: { id: Number(category_id) },
      });
      if (!findCategory) {
        throw new NotFoundException('Danh mục không tồn tại');
      }

      // Ready data for update
      const slug = MakeSlugger(name);
      const tagsSet = existingTags.map((tag) => ({ id: Number(tag.id) }));

      const updateData: any = {
        category_id,
        name,
        slug,
        description,
        short_description,
        price,
        tags: { set: tagsSet },
      };

      // Upload images if available
      if (files.images && files.images.length > 0) {
        const uploadImages =
          await this.cloudinaryService.uploadMultipleFilesToFolder(
            files.images,
            'joiepalace/products',
          );
        if (!uploadImages) {
          throw new BadRequestException('Upload ảnh thất bại');
        }
        // Delete old images
        await this.cloudinaryService.deleteMultipleImagesByUrl(
          findproduct.images,
        );
        updateData.images = uploadImages;
      }

      // Update product
      const updatedproduct = await this.prismaService.products.update({
        where: { id: Number(id) },
        data: updateData,
      });

      throw new HttpException(
        {
          message: 'Cập nhật Sản phẩm thành công',
          data: FormatReturnData(updatedproduct, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Nếu là ngoại lệ đã biết, tái ném ra
      }
      console.log('Lỗi từ products.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Remove product
  async deleteProduct(reqUser, id: number) {
    try {
      const findproduct = await this.prismaService.products.findUnique({
        where: { id: Number(id) },
      });
      if (!findproduct) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      if (findproduct.deleted) {
        throw new BadRequestException('Sản phẩm đã bị xóa');
      }

      const deleteProduct = await this.prismaService.products.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_at: new Date(),
          deleted_by: reqUser.id,
        },
      });

      throw new HttpException(
        { message: 'Xóa Sản phẩm thành công' },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> deleteProduct', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Restore product
  async restoreproduct(id: number) {
    try {
      const findproduct = await this.prismaService.products.findUnique({
        where: { id: Number(id) },
      });
      if (!findproduct) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      if (!findproduct.deleted) {
        throw new BadRequestException('Sản phẩm chưa bị xóa');
      }

      const restoreproduct = await this.prismaService.products.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      });

      throw new HttpException(
        { message: 'Khôi phục Sản phẩm thành công' },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> restoreproduct', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }

  // ! Destroy product
  async destroy(id: number) {
    try {
      const findproduct = await this.prismaService.products.findUnique({
        where: { id: Number(id) },
      });
      if (!findproduct) {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }

      // Delete images
      await this.cloudinaryService.deleteMultipleImagesByUrl(
        findproduct.images,
      );
      await this.prismaService.products.delete({
        where: { id: Number(id) },
      });

      throw new HttpException('Xóa Sản phẩm thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ products.service.ts -> destroy', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error,
      );
    }
  }
}
