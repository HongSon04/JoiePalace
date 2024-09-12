import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';

@Injectable()
export class FoodsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create food
  async create(
    createFoodDto: CreateFoodDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { category_id, name, description, short_description, tags, price } =
        createFoodDto;

      // Validate inputs
      if (!files.images || files.images.length === 0) {
        throw new HttpException(
          'Ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!category_id || !name || !price) {
        throw new HttpException(
          'Thông tin không đầy đủ',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check food existence
      const existingFood = await this.prismaService.foods.findFirst({
        where: { name },
      });

      if (existingFood) {
        throw new HttpException('Món ăn đã tồn tại', HttpStatus.BAD_REQUEST);
      }

      // Check tags existence
      const existingTags = await this.prismaService.tags.findMany({
        where: { id: { in: tags } }, // Assuming tags is already an array of numbers
      });

      if (existingTags.length !== tags.length) {
        throw new HttpException(
          'Một hoặc nhiều tag không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check category existence
      const existingCategory = await this.prismaService.categories.findUnique({
        where: { id: Number(category_id) },
      });

      if (!existingCategory) {
        throw new HttpException(
          'Danh mục không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joieplace/foods',
        );

      if (!uploadImages) {
        throw new HttpException('Upload ảnh thất bại', HttpStatus.BAD_REQUEST);
      }

      // Create food entry
      const slug = MakeSlugger(name);
      const tagsConnect = existingTags.map((tag) => ({ id: tag.id }));

      const createFood = await this.prismaService.foods.create({
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

      return {
        message: 'Tạo món ăn thành công',
        data: createFood,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> create', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all foods
  async findAll(query: FilterPriceDto) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query.priceSort.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(
        minPrice,
        Number(query.maxPrice) || 999999999999,
      );

      // Tạo điều kiện tìm kiếm
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
      };

      // Điều kiện giá
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { gte: minPrice, lte: maxPrice } });
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

      // Lấy danh sách món ăn và tổng số
      const [foods, totalCount] = await Promise.all([
        this.prismaService.foods.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.foods.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: foods, pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> findAll', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all deleted foods
  async findAllDeleted(query: FilterPriceDto) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query.priceSort.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(
        minPrice,
        Number(query.maxPrice) || 999999999999,
      );

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
      };

      // Điều kiện giá
      if (minPrice >= 0) {
        if (!whereConditions.AND) whereConditions.AND = [];
        whereConditions.AND.push({ price: { gte: minPrice, lte: maxPrice } });
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

      // Lấy danh sách món ăn và tổng số
      const [foods, totalCount] = await Promise.all([
        this.prismaService.foods.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.foods.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: foods, pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all foods by category
  async findOne(id: number) {
    try {
      const food = await this.prismaService.foods.findFirst({
        where: { id: Number(id) },
        include: {
          categories: true,
          tags: true,
        },
      });
      throw new HttpException(
        {
          data: {
            ...food,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> findOne', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all foods by slug
  async findBySlug(slug: string) {
    try {
      const food = await this.prismaService.foods.findFirst({
        where: { slug },
        include: {
          categories: true,
          tags: true,
        },
      });

      throw new HttpException(
        {
          data: food,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> findBySlug', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all foods by category id
  async findByCategoryId(query: FilterPriceDto, category_id: number) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query.priceSort.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(
        minPrice,
        Number(query.maxPrice) || 999999999999,
      );

      // Tạo điều kiện tìm kiếm
      const whereConditions: any = {
        deleted: false,
        category_id,
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
        whereConditions.AND.push({ price: { gte: minPrice, lte: maxPrice } });
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

      // Lấy danh sách món ăn và tổng số
      const [foods, totalCount] = await Promise.all([
        this.prismaService.foods.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.foods.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: foods, pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> findByCategoryId', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Get all foods by tag id
  async findByTagId(query: FilterPriceDto, tag_id: number) {
    try {
      // Parse và gán giá trị mặc định cho các tham số
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;
      const priceSort = query.priceSort.toLowerCase();

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : null;
      const endDate = query.endDate
        ? FormatDateToEndOfDay(query.endDate)
        : null;

      const minPrice = Math.max(0, Number(query.minPrice) || 0);
      const maxPrice = Math.max(
        minPrice,
        Number(query.maxPrice) || 999999999999,
      );

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
        whereConditions.AND.push({ price: { gte: minPrice, lte: maxPrice } });
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

      // Lấy danh sách món ăn và tổng số
      const [foods, totalCount] = await Promise.all([
        this.prismaService.foods.findMany({
          where: whereConditions,
          include: { categories: true, tags: true },
          skip,
          take: itemsPerPage,
          orderBy: { ...orderByConditions, created_at: 'desc' },
        }),
        this.prismaService.foods.count({ where: whereConditions }),
      ]);

      // Tính toán các trang
      const lastPage = Math.ceil(totalCount / itemsPerPage);
      const paginationInfo = {
        nextPage: page + 1 > lastPage ? null : page + 1,
        prevPage: page - 1 <= 0 ? null : page - 1,
        lastPage: lastPage,
        itemsPerPage,
        currentPage: page,
      };

      // Trả về kết quả
      throw new HttpException(
        { data: foods, pagination: paginationInfo },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> findByTagId', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Update food
  async update(
    id: number,
    updateFoodDto: UpdateFoodDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { category_id, name, description, short_description, tags, price } =
        updateFoodDto;

      // Check food existence
      const findFood = await this.prismaService.foods.findUnique({
        where: { id: Number(id) },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      // Check food existence by name
      const findFoodByName = await this.prismaService.foods.findFirst({
        where: { name, id: { not: id } },
      });
      if (findFoodByName) {
        throw new HttpException(
          'Tên món ăn đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Handle tags
      const tagsArray = JSON.parse(tags as any) || [];
      const existingTags = await this.prismaService.tags.findMany({
        where: { id: { in: tagsArray.map((tagId: number) => Number(tagId)) } },
      });

      if (existingTags.length !== tagsArray.length) {
        throw new HttpException(
          'Một hoặc nhiều tag không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check category existence
      const findCategory = await this.prismaService.categories.findUnique({
        where: { id: category_id },
      });
      if (!findCategory) {
        throw new HttpException(
          'Danh mục không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Ready data for update
      const slug = MakeSlugger(name);
      const tagsSet = existingTags.map((tag) => ({ id: tag.id }));

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
            'joieplace/foods',
          );
        if (!uploadImages) {
          throw new HttpException(
            'Upload ảnh thất bại',
            HttpStatus.BAD_REQUEST,
          );
        }
        // Delete old images
        await this.cloudinaryService.deleteMultipleImagesByUrl(findFood.images);
        updateData.images = uploadImages;
      }

      // Update food
      const updatedFood = await this.prismaService.foods.update({
        where: { id: Number(id) },
        data: updateData,
      });

      throw new HttpException(
        { message: 'Cập nhật món ăn thành công', data: updatedFood },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Nếu là ngoại lệ đã biết, tái ném ra
      }
      console.log('Lỗi từ foods.service.ts -> update', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Remove food
  async removeFood(reqUser, id: number) {
    try {
      const findFood = await this.prismaService.foods.findUnique({
        where: { id: Number(id) },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      if (findFood.deleted) {
        throw new HttpException('Món ăn đã bị xóa', HttpStatus.BAD_REQUEST);
      }

      const removeFood = await this.prismaService.foods.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_at: new Date(),
          deleted_by: reqUser.id,
        },
      });

      throw new HttpException(
        { message: 'Xóa món ăn thành công', data: removeFood },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> removeFood', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Restore food
  async restoreFood(id: number) {
    try {
      const findFood = await this.prismaService.foods.findUnique({
        where: { id: Number(id) },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      if (!findFood.deleted) {
        throw new HttpException('Món ăn chưa bị xóa', HttpStatus.BAD_REQUEST);
      }

      const restoreFood = await this.prismaService.foods.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      });

      throw new HttpException(
        { message: 'Khôi phục món ăn thành công', data: restoreFood },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> restoreFood', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ! Destroy food
  async destroy(id: number) {
    try {
      const findFood = await this.prismaService.foods.findUnique({
        where: { id: Number(id) },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      // Delete images
      await this.cloudinaryService.deleteMultipleImagesByUrl(findFood.images);
      await this.prismaService.foods.delete({
        where: { id: Number(id) },
      });

      throw new HttpException('Xóa món ăn thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ foods.service.ts -> destroy', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }
}
