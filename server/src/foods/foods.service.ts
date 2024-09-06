import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterFoodDto } from './dto/filter-food.dto';

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
      if (!files.images) {
        throw new HttpException(
          'Ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { category_id, name, description, short_description, tags, price } =
        createFoodDto;

      // Validate inputs
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

      const tagsParse = JSON.parse(tags as any);

      // Check tags existence
      const existingTags = await this.prismaService.tags.findMany({
        where: { id: { in: tagsParse.map((tagId) => Number(tagId)) } },
      });

      if (existingTags.length !== tagsParse.length) {
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

      // Create food
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

      throw new HttpException(
        { message: 'Tạo món ăn thành công', data: createFood },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // ! Get all foods
  async findAll(query: FilterFoodDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 999999999999;

    // Tạo mảng điều kiện để tìm kiếm
    const whereConditions: any = {
      deleted: false,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
        {
          categories: {
            name: { contains: search, mode: 'insensitive' }, // Tìm kiếm theo tên danh mục
          },
        },
        {
          tags: {
            some: {
              name: { contains: search, mode: 'insensitive' }, // Tìm kiếm theo tên thẻ
            },
          },
        },
      ],
    };

    // Điều kiện giá
    if (minPrice > 0) {
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

    // Lấy danh sách món ăn theo trang và tìm kiếm
    const [foods, totalCount] = await Promise.all([
      this.prismaService.foods.findMany({
        where: whereConditions,
        include: {
          categories: true, // Bao gồm thông tin danh mục
          tags: true, // Bao gồm thông tin thẻ
        },
        skip,
        take: itemsPerPage,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prismaService.foods.count({
        where: whereConditions,
      }),
    ]);

    const lastPage = Math.ceil(totalCount / itemsPerPage);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 <= 0 ? null : page - 1;

    throw new HttpException(
      {
        data: foods,
        pagination: { nextPage, prevPage, lastPage, currentPage: page },
      },
      HttpStatus.OK,
    );
  }

  // ! Get all deleted foods
  async findAllDeleted(query: FilterFoodDto) {
    const page = Number(query.page) || 1;
    const itemsPerPage = Number(query.itemsPerPage) || 10;
    const search = query.search || '';
    const skip = (page - 1) * itemsPerPage;

    const minPrice = Number(query.minPrice) || 0;
    const maxPrice = Number(query.maxPrice) || 999999999999;

    // Tạo mảng điều kiện để tìm kiếm
    const whereConditions: any = {
      deleted: true,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
        {
          categories: {
            name: { contains: search, mode: 'insensitive' }, // Tìm kiếm theo tên danh mục
          },
        },
        {
          tags: {
            some: {
              name: { contains: search, mode: 'insensitive' }, // Tìm kiếm theo tên thẻ
            },
          },
        },
      ],
    };

    // Điều kiện giá
    if (minPrice > 0) {
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

    // Lấy danh sách món ăn theo trang và tìm kiếm
    const [foods, totalCount] = await Promise.all([
      this.prismaService.foods.findMany({
        where: whereConditions,
        include: {
          categories: true, // Bao gồm thông tin danh mục
          tags: true, // Bao gồm thông tin thẻ
        },
        skip,
        take: itemsPerPage,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prismaService.foods.count({
        where: whereConditions,
      }),
    ]);

    const lastPage = Math.ceil(totalCount / itemsPerPage);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 <= 0 ? null : page - 1;

    throw new HttpException(
      {
        data: foods,
        pagination: { nextPage, prevPage, lastPage, currentPage: page },
      },
      HttpStatus.OK,
    );
  }

  // ! Get all foods by category
  async findOne(id: number) {
    try {
      const food = await this.prismaService.foods.findFirst({
        where: { id },
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
      throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
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

      // Check if food exists
      const findFood = await this.prismaService.foods.findUnique({
        where: { id },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      // Check if name already exists, except for the current food
      const findFoodByName = await this.prismaService.foods.findFirst({
        where: { name, id: { not: id } },
      });
      if (findFoodByName) {
        throw new HttpException(
          'Tên món ăn đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Parse tags and validate existence
      const tagsParse = JSON.parse(tags as any);
      const existingTags = await this.prismaService.tags.findMany({
        where: { id: { in: tagsParse.map((tagId) => Number(tagId)) } },
      });

      if (existingTags.length !== tagsParse.length) {
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

      const slug = MakeSlugger(name);
      const tagsConnect = existingTags.map((tag) => ({ id: tag.id }));

      // Prepare data for update
      let updateData = {
        category_id,
        name,
        slug,
        description,
        short_description,
        price,
        images: [],
        tags: {
          connect: tagsConnect,
        },
      };

      // Upload images if present
      if (files.images) {
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
        updateData.images = uploadImages;
      }

      // Perform update
      const updatedFood = await this.prismaService.foods.update({
        where: { id },
        data: updateData,
      });

      throw new HttpException(
        { message: 'Cập nhật món ăn thành công', data: updatedFood },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Cập nhật món ăn thất bại',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ! Remove food
  async removeFood(reqUser, id: number) {
    try {
      const findFood = await this.prismaService.foods.findUnique({
        where: { id },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      if (findFood.deleted) {
        throw new HttpException('Món ăn đã bị xóa', HttpStatus.BAD_REQUEST);
      }

      const removeFood = await this.prismaService.foods.update({
        where: { id },
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
      throw new HttpException('Xóa món ăn thất bại', HttpStatus.BAD_REQUEST);
    }
  }

  // ! Restore food
  async restoreFood(id: number) {
    try {
      const findFood = await this.prismaService.foods.findUnique({
        where: { id },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      if (!findFood.deleted) {
        throw new HttpException('Món ăn chưa bị xóa', HttpStatus.BAD_REQUEST);
      }

      const restoreFood = await this.prismaService.foods.update({
        where: { id },
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
      throw new HttpException(
        'Khôi phục món ăn thất bại',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ! Destroy food
  async destroy(id: number) {
    try {
      const findFood = await this.prismaService.foods.findUnique({
        where: { id },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      const deleteFood = await this.prismaService.foods.delete({
        where: { id },
      });

      throw new HttpException(
        { message: 'Xóa món ăn thành công', data: deleteFood },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Xóa món ăn thất bại', HttpStatus.BAD_REQUEST);
    }
  }
}
