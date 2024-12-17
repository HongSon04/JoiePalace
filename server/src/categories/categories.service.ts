import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
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
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/FilterCategoryDto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ! Create Categories
  async create(
    createCategoryDto: CreateCategoryDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { name, description, short_description, category_id, tags } =
        createCategoryDto;

      // Check Name and Slug
      const slug = MakeSlugger(name);
      const existingCategory = await this.prismaService.categories.findFirst({
        where: {
          OR: [{ name }, { slug }],
        },
      });

      if (existingCategory) {
        throw new BadRequestException({ message: 'Tên danh mục đã tồn tại' });
      }

      // Upload images if available
      const images =
        files.images && files?.images?.length > 0
          ? await this.cloudinaryService.uploadMultipleFilesToFolder(
              files.images,
              'joiepalace/categories',
            )
          : ([] as any);

      if (files.images && files?.images?.length > 0 && !images) {
        throw new BadRequestException('Upload ảnh thất bại');
      }

      // Initialize tagsSet
      let tagsSet = [];

      // Handle tags if provided
      if (tags && tags.length > 0) {
        const tagsArray = JSON.parse(tags as any);
        const existingTags = await this.prismaService.tags.findMany({
          where: { id: { in: tagsArray } },
        });

        if (existingTags.length !== tagsArray.length) {
          throw new NotFoundException('Một hoặc nhiều tag không tồn tại');
        }

        // Set tagsSet if tags exist
        tagsSet = existingTags.map((tag) => ({ id: Number(tag.id) }));
      }

      // Create Categories
      const categories = await this.prismaService.categories.create({
        data: {
          name,
          slug,
          description,
          short_description,
          category_id: Number(category_id) || null,
          images,
          tags: { connect: tagsSet },
        },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      // ? Delete Cache
      await this.cacheManager.del('categories-get-all');

      throw new HttpException(
        {
          message: 'Tạo danh mục thành công',
          data: FormatReturnData(categories, []),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> create', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get All Categories
  async findAll(query: FilterCategoryDto) {
    try {
      const cacheKey = `categories-${JSON.stringify(query)}`;
      const cachedData = await this.cacheManager.get(cacheKey);

      if (cachedData) {
        throw new HttpException({ data: cachedData }, HttpStatus.OK);
      }
      const search = query.search || '';

      const startDate = query.startDate
        ? FormatDateToStartOfDay(query.startDate)
        : '';
      const endDate = query.endDate ? FormatDateToEndOfDay(query.endDate) : '';

      const sortRangeDate: any =
        startDate && endDate
          ? {
              created_at: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {};

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
            short_description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      if (query.deleted) {
        whereConditions.deleted = String(query.deleted) === 'true';
      }

      const [rootCategories, childCategories, total] =
        await this.prismaService.$transaction([
          this.prismaService.categories.findMany({
            where: {
              ...whereConditions,
              category_id: null,
            },
            include: {
              tags: true,
              products: {
                include: { tags: true },
              },
            },
          }),
          this.prismaService.categories.findMany({
            where: {
              ...whereConditions,
              category_id: {
                not: null,
              },
            },
            include: {
              tags: true,
              products: {
                include: { tags: true },
              },
            },
          }),
          this.prismaService.categories.count({
            where: whereConditions,
          }),
        ]);

      // 4. Build tree structure
      const categoriesTree = this.buildOptimizedCategoryTree(
        rootCategories,
        childCategories,
      );

      // 5. Cache kết quả
      await this.cacheManager.set(cacheKey, categoriesTree, {
        ttl: 60 * 5,
      } as any);

      throw new HttpException(
        {
          data: categoriesTree,
          total,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> ', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get One Category
  async findOne(id: number) {
    try {
      const rootCategory = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!rootCategory) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }

      const childCategories = await this.prismaService.categories.findMany({
        where: {
          deleted: false,
          category_id: Number(id),
        },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      const categoriesTree = this.buildOptimizedCategoryTree(
        [...[rootCategory]],
        FormatReturnData(childCategories, []),
      );
      throw new HttpException(
        { data: FormatReturnData(categoriesTree, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> findOne', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get One Category By Slug
  async findOneBySlug(slug: string) {
    try {
      const rootCategory = await this.prismaService.categories.findUnique({
        where: { slug },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!rootCategory) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }

      const childCategories = await this.prismaService.categories.findMany({
        where: {
          deleted: false,
          category_id: Number(rootCategory.id),
        },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      const categoriesTree = this.buildOptimizedCategoryTree(
        [...[rootCategory]],
        FormatReturnData(childCategories, []),
      );
      throw new HttpException(
        { data: FormatReturnData(categoriesTree, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> findOneBySlug', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get Category By Tag Slug
  async findCategoryByTagSlug(tag_slug: string) {
    try {
      const findTag = await this.prismaService.tags.findUnique({
        where: { slug: tag_slug },
      });

      if (!findTag) {
        throw new NotFoundException({ message: 'Không tìm thấy tag' });
      }

      const rootCategory = await this.prismaService.categories.findMany({
        where: {
          tags: {
            some: {
              slug: findTag.slug,
            },
          },
        },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      if (!rootCategory) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }

      const childCategories = await this.prismaService.categories.findMany({
        where: {
          deleted: false,
        },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      const categoriesTree = this.buildOptimizedCategoryTree(
        [...[rootCategory]],
        FormatReturnData(childCategories, []),
      );

      throw new HttpException(
        { data: FormatReturnData(categoriesTree, []) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(
        'Lỗi từ categories.service.ts -> findCategoryByTagSlug',
        error,
      );
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update Categories
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!findCategories) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }

      const { name, description, short_description, category_id, tags } =
        updateCategoryDto;
      const slug = MakeSlugger(name);
      // ? Check Name and Slug
      // const findCategoriesByName =
      //   await this.prismaService.categories.findFirst({
      //     where: { AND: [{ name }, { id: { not: Number(id) } }] },
      //   });
      // if (findCategoriesByName) {
      //   throw new BadRequestException({ message: 'Tên danh mục đã tồn tại' });
      // }

      // Upload images if available
      let uploadImages;

      if (files?.images?.length > 0) {
        uploadImages = await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/packages',
        );

        if (!uploadImages) {
          throw new BadRequestException('Upload ảnh thất bại');
        }
      }

      // Initialize tagsSet
      let tagsSet = [];

      // Handle tags if provided
      if (tags && tags.length > 0) {
        const tagsArray = JSON.parse(tags as any);
        const existingTags = await this.prismaService.tags.findMany({
          where: { id: { in: tagsArray } },
        });

        if (existingTags.length !== tagsArray.length) {
          throw new NotFoundException('Một hoặc nhiều tag không tồn tại');
        }

        // Set tagsSet if tags exist
        tagsSet = existingTags.map((tag) => ({ id: Number(tag.id) }));
      }

      // ? Update Categories
      const categories = await this.prismaService.categories.update({
        where: { id: Number(id) },
        data: {
          name,
          slug,
          description,
          short_description,
          category_id: category_id
            ? Number(category_id)
            : findCategories.category_id
              ? Number(findCategories.category_id)
              : null,
          images: [...(uploadImages || []), ...(findCategories.images || [])],
          tags: { set: tagsSet },
        },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      });

      await this.cacheManager.del('categories-get-all');

      throw new HttpException(
        {
          message: 'Cập nhật danh mục thành công',
          data: FormatReturnData(categories, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> update', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Soft Delete Categories
  async softDelete(reqUser, id: number) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!findCategories) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }
      // ? Soft Delete Categories
      await this.prismaService.categories.update({
        where: { id: Number(id) },
        data: {
          deleted: true,
          deleted_by: reqUser.id,
          deleted_at: new Date(),
        },
      });
      throw new HttpException(
        {
          message: 'Xóa danh mục thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> softDelete', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Restore Categories
  async restore(id: number) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
      });
      if (!findCategories) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }

      if (!findCategories.deleted) {
        throw new BadRequestException({
          message: 'Danh mục chưa bị xóa tạm thời, không thể khôi phục!',
        });
      }
      // ? Restore Categories
      const categories = await this.prismaService.categories.update({
        where: { id: Number(id) },
        data: {
          deleted: false,
          deleted_by: null,
          deleted_at: null,
        },
      });
      throw new HttpException(
        {
          message: 'Khôi phục danh mục thành công',
          data: FormatReturnData(categories, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> restore', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Destroy Categories
  async destroy(id: number) {
    try {
      // ? Check Categories
      const findCategories = await this.prismaService.categories.findUnique({
        where: { id: Number(id) },
        include: {
          products: true,
        },
      });
      if (!findCategories) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }

      if (!findCategories.deleted) {
        throw new BadRequestException({
          message: 'Danh mục chưa bị xóa tạm thời, không thể xóa vĩnh viễn!',
        });
      }

      if (findCategories.products.length > 0) {
        throw new BadRequestException({
          message: 'Danh mục đang chứa sản phẩm, không thể xóa vĩnh viễn!',
        });
      }
      // ? Destroy Categories
      const categories = await this.prismaService.categories.delete({
        where: { id: Number(id) },
      });

      throw new HttpException(
        {
          message: 'Xóa danh mục vĩnh viễn thành công',
          data: FormatReturnData(categories, []),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> destroy', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  private buildOptimizedCategoryTree(
    rootCategories: any[],
    allCategories: any[],
  ) {
    const categoryMap = new Map();

    allCategories.forEach((category) => {
      categoryMap.set(category.id, { ...category, childrens: [] });
    });
    rootCategories.forEach((category) => {
      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, { ...category, childrens: [] });
      }
    });

    allCategories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id);
      const parent = categoryMap.get(category.category_id);

      if (parent) {
        parent.childrens.push(categoryWithChildren);
      }
    });

    // Chỉ trả về các root category và cây con của chúng
    return rootCategories.map((root) => categoryMap.get(root.id));
  }
}
