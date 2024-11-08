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
        files.images && files.images.length > 0
          ? await this.cloudinaryService.uploadMultipleFilesToFolder(
              files.images,
              'joiepalace/categories',
            )
          : ([] as any);

      if (files.images && files.images.length > 0 && !images) {
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
      const cacheCategory = await this.cacheManager.get('categories-get-all');
      console.log('cacheCategory', cacheCategory);
      if (cacheCategory) {
        throw new HttpException(
          {
            data: cacheCategory,
          },
          HttpStatus.OK,
        );
      }
      // const page = Number(query.page) || 1;
      // const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      // const skip = (page - 1) * itemsPerPage;

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

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.categories.findMany({
          where: whereConditions,
          include: {
            tags: true,
            products: {
              include: {
                tags: true,
              },
            },
          },
        }),
        this.prismaService.categories.count({
          where: whereConditions,
        }),
      ]);

      // const lastPage = Math.ceil(total / itemsPerPage);
      // const paginationInfo = {
      //   lastPage,
      //   nextPage: page < lastPage ? page + 1 : null,
      //   prevPage: page > 1 ? page - 1 : null,
      //   currentPage: page,
      //   itemsPerPage,
      //   total,
      // };

      let FormatData = FormatReturnData(res, []);
      const categories = this.buildCategoryTree(FormatData);

      await this.cacheManager.set('categories-get-all', categories, {
        ttl: 60 * 5,
      } as any);

      throw new HttpException(
        {
          data: categories,
          // pagination: paginationInfo,
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

  // ! Get All Deleted Categories
  async findAllDeleted(query: FilterCategoryDto) {
    try {
      // const page = Number(query.page) || 1;
      // const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      // const skip = (page - 1) * itemsPerPage;

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
            short_description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      const [res, total] = await this.prismaService.$transaction([
        this.prismaService.categories.findMany({
          where: whereConditions,
          include: {
            tags: true,
            products: {
              include: {
                tags: true,
              },
            },
          },
        }),
        this.prismaService.categories.count({
          where: whereConditions,
        }),
      ]);

      // const lastPage = Math.ceil(total / itemsPerPage);
      // const paginationInfo = {
      //   lastPage,
      //   nextPage: page < lastPage ? page + 1 : null,
      //   prevPage: page > 1 ? page - 1 : null,
      //   currentPage: page,
      //   itemsPerPage,
      //   total,
      // };

      let FormatData = FormatReturnData(res, []);
      const categories = this.buildCategoryTree(FormatData);

      throw new HttpException(
        {
          data: categories,
          // pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categories.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get One Category
  async findOne(id: number) {
    try {
      const category = await this.prismaService.categories.findUnique({
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
      if (!category) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }
      throw new HttpException(
        { data: FormatReturnData(category, []) },
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
      const category = (await this.prismaService.categories.findUnique({
        where: {
          slug,
        },
        include: {
          tags: true,
          products: {
            include: {
              tags: true,
            },
          },
        },
      })) as any;
      // ? Find Children Categories
      const childrenCategories = await this.prismaService.categories.findMany({
        where: {
          category_id: Number(category.id),
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
      if (childrenCategories.length > 0) {
        category.children = FormatReturnData(childrenCategories, []);
      }
      if (!category) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
      }
      throw new HttpException(
        { data: FormatReturnData(category, []) },
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

      const categories = await this.prismaService.categories.findMany({
        where: {
          tags: {
            some: {
              slug: tag_slug,
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

      let FormatData = FormatReturnData(categories, []);
      const data = this.buildCategoryTree(FormatData);

      throw new HttpException({ data: data }, HttpStatus.OK);
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
      const findCategoriesByName =
        await this.prismaService.categories.findFirst({
          where: { AND: [{ name }, { id: { not: Number(id) } }] },
        });
      if (findCategoriesByName) {
        throw new BadRequestException({ message: 'Tên danh mục đã tồn tại' });
      }

      // Upload images if available
      const images =
        files.images && files.images.length > 0
          ? await this.cloudinaryService.uploadMultipleFilesToFolder(
              files.images,
              'joiepalace/categories',
            )
          : ([] as any);

      if (files.images && files.images.length > 0 && !images) {
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
          images: images.length > 0 ? images : findCategories.images,
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

  // ! Đệ quy lấy danh sách danh mục
  buildCategoryTree(categories) {
    const categoryMap = new Map();
    const usedInChildren = new Set();

    categories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
      });
    });

    const rootCategories = [];

    categoryMap.forEach((node) => {
      if (node.category_id === null) {
        rootCategories.push(node);
      } else {
        const parentNode = categoryMap.get(node.category_id);
        if (parentNode) {
          parentNode.children.push(node);
          usedInChildren.add(node.id);
        } else {
          rootCategories.push(node);
        }
      }
    });

    return rootCategories.filter((node) => !usedInChildren.has(node.id));
  }
}
