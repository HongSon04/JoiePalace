import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';
import {
  FormatDateToEndOfDay,
  FormatDateToStartOfDay,
} from 'helper/formatDate';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FormatReturnData } from 'helper/FormatReturnData';

@Injectable()
export class CategoriesService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
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
          category_id: category_id || null,
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
  async findAll(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

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
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.categories.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };

      let FormatData = FormatReturnData(res, []);
      const categories = this.buildCategoryTree(FormatData);

      throw new HttpException(
        {
          data: FormatReturnData(categories, []),
          pagination: paginationInfo,
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
  async findAllDeleted(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

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
          skip,
          take: itemsPerPage,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prismaService.categories.count({
          where: whereConditions,
        }),
      ]);

      const lastPage = Math.ceil(total / itemsPerPage);
      const paginationInfo = {
        lastPage,
        nextPage: page < lastPage ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
        currentPage: page,
        itemsPerPage,
        total,
      };

      let FormatData = FormatReturnData(res, []);
      const categories = this.buildCategoryTree(FormatData);

      throw new HttpException(
        {
          data: FormatReturnData(categories, []),
          pagination: paginationInfo,
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
          category_id: category.id,
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
          where: {
            OR: [{ name }, { slug }],
            NOT: {
              id: Number(id),
            },
          },
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
          category_id: category_id || null,
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
      });
      if (!findCategories) {
        throw new NotFoundException({ message: 'Không tìm thấy danh mục' });
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
  buildCategoryTree(categories, parentId = null) {
    const categoryTree = [];

    categories.forEach((category) => {
      if (category.category_id === parentId) {
        const children = this.buildCategoryTree(categories, category.id);
        if (children.length) {
          category.children = children;
        }
        categoryTree.push(category);
      }
    });

    return categoryTree;
  }
}
