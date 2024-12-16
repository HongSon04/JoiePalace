import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';
import { FormatReturnData } from 'helper/FormatReturnData';

@Injectable()
export class BlogsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ! Create a new blog
  async create(
    createBlogDto: CreateBlogDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const {
        title,
        content,
        category_id,
        tags,
        description,
        short_description,
      } = createBlogDto;

      // Validate inputs
      if (!files.images || files.images.length === 0) {
        throw new HttpException(
          'Ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      const slug = MakeSlugger(title);

      // Check blog existence
      const existingBlog = await this.prismaService.blogs.findFirst({
        where: { slug: slug },
      });

      if (existingBlog) {
        throw new HttpException(
          'Tên bài viết đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check category existence
      const existingCategory = await this.prismaService.categories.findFirst({
        where: { id: Number(category_id) },
      });

      if (!existingCategory) {
        throw new HttpException(
          'Danh mục không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
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

      // Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/blogs',
        );

      if (!uploadImages) {
        throw new HttpException('Upload ảnh thất bại', HttpStatus.BAD_REQUEST);
      }

      const createBlog = await this.prismaService.blogs.create({
        data: {
          title,
          slug,
          content,
          description,
          short_description,
          category_id: Number(category_id),
          tags: {
            connect: tagsSet,
          },
          images: uploadImages as any,
        },
        include: {
          tags: true,
          categories: true,
        },
      });

      throw new HttpException(
        {
          message: 'Tạo bài viết thành công',
          data: FormatReturnData(createBlog, ['deleted_by', 'updated_by']),
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> create', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all blogs
  async findAll(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const whereConditions: any = {
        deleted: false,
      };

      if (search) {
        whereConditions.OR = [
          {
            title: {
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
            slug: {
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

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip: Number(skip),
          take: itemsPerPage,
          include: {
            tags: true,
            categories: true,
          },
        }),
        this.prismaService.blogs.count({
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

      throw new HttpException(
        {
          data: FormatReturnData(res, ['deleted_by', 'updated_by']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAll', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all blogs deleted
  async findAllDeleted(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const whereConditions: any = {
        deleted: true,
      };

      if (search) {
        whereConditions.OR = [
          {
            title: {
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
            slug: {
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

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip: Number(skip),
          take: itemsPerPage,
          include: {
            tags: true,
            categories: true,
          },
        }),
        this.prismaService.blogs.count({
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

      throw new HttpException(
        {
          data: FormatReturnData(res, ['deleted_by', 'updated_by']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all blogs by category
  async findAllByCategory(category_id: string, query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const whereConditions: any = {
        deleted: false,
        category_id: Number(category_id),
      };

      if (search) {
        whereConditions.OR = [
          {
            title: {
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
            slug: {
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

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip: Number(skip),
          take: itemsPerPage,
          include: {
            tags: true,
            categories: true,
          },
        }),
        this.prismaService.blogs.count({
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

      throw new HttpException(
        {
          data: FormatReturnData(res, ['deleted_by', 'updated_by']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAllByCategory', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all blogs by slug category
  async findAllBySlugCategory(slug: string, query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const category = await this.prismaService.categories.findFirst({
        where: { slug },
      });

      if (!category) {
        throw new HttpException(
          'Không tìm thấy danh mục',
          HttpStatus.NOT_FOUND,
        );
      }

      const whereConditions: any = {
        deleted: false,
        category_id: Number(category.id),
      };

      if (search) {
        whereConditions.OR = [
          {
            title: {
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
            slug: {
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

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip: Number(skip),
          take: itemsPerPage,
          include: {
            tags: true,
            categories: true,
          },
        }),
        this.prismaService.blogs.count({
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

      throw new HttpException(
        {
          data: FormatReturnData(res, ['deleted_by', 'updated_by']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAllBySlugCategory', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all blogs by tag
  async findAllByTag(tag_id: string, query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const tag = await this.prismaService.tags.findFirst({
        where: { id: Number(tag_id) },
      });

      if (!tag) {
        throw new HttpException('Không tìm thấy tag', HttpStatus.NOT_FOUND);
      }

      const whereConditions: any = {
        deleted: false,
        tags: {
          some: {
            id: Number(tag.id),
          },
        },
      };

      if (search) {
        whereConditions.OR = [
          {
            title: {
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
            slug: {
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

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip: Number(skip),
          take: itemsPerPage,
          include: {
            tags: true,
            categories: true,
          },
        }),
        this.prismaService.blogs.count({
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

      throw new HttpException(
        {
          data: FormatReturnData(res, ['deleted_by', 'updated_by']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAllByTag', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get all blogs by slug tag
  async findAllBySlugTag(slug: string, query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const tag = await this.prismaService.tags.findFirst({
        where: { slug },
      });

      if (!tag) {
        throw new HttpException('Không tìm thấy tag', HttpStatus.NOT_FOUND);
      }

      const whereConditions: any = {
        deleted: false,
        tags: {
          some: {
            id: Number(tag.id),
          },
        },
      };

      if (search) {
        whereConditions.OR = [
          {
            title: {
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
            slug: {
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

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip: Number(skip),
          take: itemsPerPage,
          include: {
            tags: true,
            categories: true,
          },
        }),
        this.prismaService.blogs.count({
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

      throw new HttpException(
        {
          data: FormatReturnData(res, ['deleted_by', 'updated_by']),
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAllBySlugTag', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Get a blog by id
  async findOne(id: number) {
    try {
      const blog = await this.prismaService.blogs.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          tags: true,
          categories: true,
        },
      });

      if (!blog) {
        throw new HttpException(
          'Không tìm thấy bài viết',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prismaService.blogs.update({
        where: { id: Number(blog.id) },
        data: {
          views: Number(blog.views) + 1,
        },
      });

      throw new HttpException(
        { data: FormatReturnData(blog, ['deleted_by, updated_by']) },
        HttpStatus.OK,
      );
    } catch (error) {}
  }

  // ! Get a blog by slug
  async findOneBySlug(slug: string) {
    try {
      const blog = await this.prismaService.blogs.findFirst({
        where: {
          slug,
        },
        include: {
          tags: true,
          categories: true,
        },
      });

      if (!blog) {
        throw new HttpException(
          'Không tìm thấy bài viết',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prismaService.blogs.update({
        where: { id: Number(blog.id) },
        data: {
          views: Number(blog.views) + 1,
        },
      });

      throw new HttpException(
        { data: FormatReturnData(blog, ['deleted_by, updated_by']) },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findOneBySlug', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update a blog by id
  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const {
        title,
        content,
        category_id,
        tags,
        description,
        short_description,
      } = updateBlogDto;

      const slug = MakeSlugger(title);

      // Check blog existence
      const existingBlog = await this.prismaService.blogs.findFirst({
        where: { id: Number(id) },
      });

      if (!existingBlog) {
        throw new HttpException(
          'Bài viết không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check category existence
      const existingCategory = await this.prismaService.categories.findFirst({
        where: { id: Number(category_id) },
      });

      if (!existingCategory) {
        throw new HttpException(
          'Danh mục không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check slug existence
      const existingSlug = await this.prismaService.blogs.findFirst({
        where: { slug: slug },
      });

      if (existingSlug && Number(existingSlug.id) !== Number(id)) {
        throw new HttpException(
          'Tên bài viết đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
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

      // Upload images
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

      const updateBlog = await this.prismaService.blogs.update({
        where: { id: Number(id) },
        data: {
          title,
          slug,
          content,
          description,
          short_description,
          category_id: Number(category_id),
          tags: {
            connect: tagsSet,
          },
          images: [...(uploadImages || []), ...(existingBlog.images || [])],
        },
        include: {
          tags: true,
          categories: true,
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật bài viết thành công',
          data: FormatReturnData(updateBlog, ['deleted_by, updated_by']),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> update', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Update a blog by slug
  async updateBySlug(
    slug: string,
    updateBlogDto: UpdateBlogDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const {
        title,
        content,
        category_id,
        tags,
        description,
        short_description,
      } = updateBlogDto;

      // Validate inputs
      if (!files.images || files.images.length === 0) {
        throw new HttpException(
          'Ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newSlug = MakeSlugger(title);

      // Check blog existence
      const existingBlog = await this.prismaService.blogs.findFirst({
        where: { slug },
      });

      if (!existingBlog) {
        throw new HttpException(
          'Bài viết không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check category existence
      const existingCategory = await this.prismaService.categories.findFirst({
        where: { id: Number(category_id) },
      });

      if (!existingCategory) {
        throw new HttpException(
          'Danh mục không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check slug existence
      const existingSlug = await this.prismaService.blogs.findFirst({
        where: { slug: newSlug },
      });

      if (existingSlug && Number(existingSlug.id) !== Number(existingBlog.id)) {
        throw new HttpException(
          'Tên bài viết đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
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

      // Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/blogs',
        );

      if (!uploadImages) {
        throw new HttpException('Upload ảnh thất bại', HttpStatus.BAD_REQUEST);
      }

      const updateBlog = await this.prismaService.blogs.update({
        where: { id: Number(existingBlog.id) },
        data: {
          title,
          slug: newSlug,
          content,
          description,
          short_description,
          category_id: Number(category_id),
          tags: {
            connect: tagsSet,
          },
          images: uploadImages as any,
        },
        include: {
          tags: true,
          categories: true,
        },
      });

      throw new HttpException(
        {
          message: 'Cập nhật bài viết thành công',
          data: FormatReturnData(updateBlog, ['deleted_by, updated_by']),
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> updateBySlug', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Soft delete a blog by id
  async delete(reqUser, id: number) {
    try {
      const blog = await this.prismaService.blogs.findFirst({
        where: { id: Number(id) },
      });

      if (!blog) {
        throw new HttpException('Bài viết không tồn tại', HttpStatus.NOT_FOUND);
      }

      await this.prismaService.blogs.update({
        where: { id: Number(id) },
        data: {
          deleted_at: new Date(),
          deleted_by: reqUser.id,
          deleted: true,
        },
      });

      throw new HttpException('Xóa bài viết thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> delete', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Restore a blog by id
  async restore(id: number) {
    try {
      const blog = await this.prismaService.blogs.findFirst({
        where: { id: Number(id) },
      });

      if (!blog) {
        throw new HttpException('Bài viết không tồn tại', HttpStatus.NOT_FOUND);
      }

      if (blog.deleted === false) {
        throw new HttpException(
          'Bài viết chưa được xóa tạm thời, không thể khôi phục!',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.blogs.update({
        where: { id: Number(id) },
        data: {
          deleted_at: null,
          deleted_by: null,
          deleted: false,
        },
      });

      throw new HttpException('Khôi phục bài viết thành công', HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> restore', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }

  // ! Hard delete a blog by id
  async hardDelete(id: number) {
    try {
      const blog = await this.prismaService.blogs.findFirst({
        where: { id: Number(id) },
      });

      if (!blog) {
        throw new HttpException('Bài viết không tồn tại', HttpStatus.NOT_FOUND);
      }

      if (blog.deleted === false) {
        throw new HttpException(
          'Bài viết chưa được xóa tạm thời, không thể xóa vĩnh viễn!',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.prismaService.blogs.delete({
        where: { id: Number(id) },
      });

      throw new HttpException(
        'Xóa bài viết vĩnh viễn thành công',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> hardDelete', error);
      throw new InternalServerErrorException({
        message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
        error: error.message,
      });
    }
  }
}
