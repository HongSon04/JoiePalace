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

      const findTags = await Promise.all(
        tags.map(async (tagId) => {
          const tag = await this.prismaService.tags.findUnique({
            where: { id: tagId },
          });
          if (!tag) {
            throw new HttpException(
              'Tag không tồn tại',
              HttpStatus.BAD_REQUEST,
            );
          }
          return tag;
        }),
      );

      if (findTags.length !== tags.length) {
        throw new HttpException('Tag không tồn tại', HttpStatus.BAD_REQUEST);
      }

      // Kiểm tra danh mục
      const findCategory = await this.prismaService.categories.findUnique({
        where: { id: category_id },
      });
      if (!findCategory) {
        throw new HttpException(
          'Danh mục không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joieplace/foods',
        );
      if (!uploadImages) {
        throw new HttpException('Upload ảnh thất bại', HttpStatus.BAD_REQUEST);
      }

      const slug = MakeSlugger(name);
      const createFood = await this.prismaService.foods.create({
        data: {
          category_id,
          name,
          slug,
          description,
          short_description,
          tags,
          price,
          images: uploadImages as any,
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
      throw new HttpException('Tạo món ăn thất bại', HttpStatus.BAD_REQUEST);
    }
  }

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

    const allTags = await this.prismaService.tags.findMany({
      where: {
        id: { in: foods.flatMap((food) => food.tags) },
      },
    });

    const foodsWithTags = foods.map((food) => ({
      ...food,
      tags: allTags.filter((tag) => food.tags.includes(tag.id)),
    }));

    const lastPage = Math.ceil(totalCount / itemsPerPage);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 <= 0 ? null : page - 1;

    throw new HttpException(
      {
        data: foodsWithTags,
        pagination: { nextPage, prevPage, lastPage, currentPage: page },
      },
      HttpStatus.OK,
    );
  }

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

    const allTags = await this.prismaService.tags.findMany({
      where: {
        id: { in: foods.flatMap((food) => food.tags) },
      },
    });

    const foodsWithTags = foods.map((food) => ({
      ...food,
      tags: allTags.filter((tag) => food.tags.includes(tag.id)),
    }));

    const lastPage = Math.ceil(totalCount / itemsPerPage);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 <= 0 ? null : page - 1;

    throw new HttpException(
      {
        data: foodsWithTags,
        pagination: { nextPage, prevPage, lastPage, currentPage: page },
      },
      HttpStatus.OK,
    );
  }

  async findOne(id: number) {
    try {
      const food = await this.prismaService.foods.findUnique({
        where: { id },
        include: {
          categories: true,
        },
      });
      const tags = await this.prismaService.tags.findMany({
        where: {
          id: { in: food.tags },
        },
      });

      throw new HttpException(
        {
          data: {
            ...food,
            tags,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
    }
  }

  async findBySlug(slug: string) {
    try {
      const food = await this.prismaService.foods.findFirst({
        where: { slug },
        include: {
          categories: true,
        },
      });
      const tags = await this.prismaService.tags.findMany({
        where: {
          id: { in: food.tags },
        },
      });

      throw new HttpException(
        {
          data: {
            ...food,
            tags,
          },
        },
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
    }
  }

  async update(
    id: number,
    updateFoodDto: UpdateFoodDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { category_id, name, description, short_description, tags, price } =
        updateFoodDto;
      const findFood = await this.prismaService.foods.findUnique({
        where: { id },
      });
      if (!findFood) {
        throw new HttpException('Món ăn không tồn tại', HttpStatus.NOT_FOUND);
      }

      const findTags = await Promise.all(
        tags.map(async (tagId) => {
          const tag = await this.prismaService.tags.findUnique({
            where: { id: tagId },
          });
          if (!tag) {
            throw new HttpException(
              'Tag không tồn tại',
              HttpStatus.BAD_REQUEST,
            );
          }
          return tag;
        }),
      );

      if (findTags.length !== tags.length) {
        throw new HttpException('Tag không tồn tại', HttpStatus.BAD_REQUEST);
      }

      // Kiểm tra danh mục
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
        const updateFood = await this.prismaService.foods.update({
          where: { id },
          data: {
            category_id,
            name,
            slug,
            description,
            short_description,
            tags,
            price,
            images: uploadImages as any,
          },
        });
        throw new HttpException(
          { message: 'Tạo món ăn thành công', data: updateFood },
          HttpStatus.CREATED,
        );
      } else {
        const updateFood = await this.prismaService.foods.update({
          where: { id },
          data: {
            category_id,
            name,
            slug,
            description,
            short_description,
            tags,
            price,
          },
        });
        throw new HttpException(
          { message: 'Tạo món ăn thành công', data: updateFood },
          HttpStatus.CREATED,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Tạo món ăn thất bại', HttpStatus.BAD_REQUEST);
    }
  }

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
