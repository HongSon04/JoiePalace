import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryBlogDto } from './dto/create-category_blog.dto';
import { UpdateCategoryBlogDto } from './dto/update-category_blog.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';

@Injectable()
export class CategoryBlogsService {
  constructor(
    private cloudinaryService: CloudinaryService,
    private prismaService: PrismaService,
  ) {}

  // ! Create Category Blog
  async create(
    createCategoryBlogDto: CreateCategoryBlogDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { name, description, short_description } = createCategoryBlogDto;
      const slug = MakeSlugger(name);

      if (!files.images || files.images.length === 0) {
        throw new HttpException(
          'Ảnh không được để trống',
          HttpStatus.BAD_REQUEST,
        );
      }

      const findCategoryBySlug =
        await this.prismaService.category_blogs.findFirst({
          where: { slug },
        });

      if (findCategoryBySlug) {
        throw new HttpException(
          'Tên danh mục đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/category_blogs',
        );

      if (!uploadImages) {
        throw new HttpException('Upload ảnh thất bại', HttpStatus.BAD_REQUEST);
      }

      // Create category blog
      const createCategoryBlog = await this.prismaService.category_blogs.create(
        {
          data: {
            name,
            slug,
            description,
            short_description,
            images: uploadImages as any,
          },
        },
      );

      throw new HttpException(
        {
          message: 'Tạo danh mục blog thành công',
          data: createCategoryBlog,
        },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.create', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }

  // ! Get All Category Blogs
  async findAll(query: FilterDto) {
    try {
      const page = Number(query.page) || 1;
      const itemsPerPage = Number(query.itemsPerPage) || 10;
      const search = query.search || '';
      const skip = (page - 1) * itemsPerPage;

      const whereConditions: any = {
        deleted: false,
        AND: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      };

      const [res, total] = await Promise.all([
        this.prismaService.category_blogs.findMany({
          where: whereConditions,
          take: itemsPerPage,
          skip,
          orderBy: { created_at: 'desc' },
        }),
        this.prismaService.category_blogs.count({
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
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.findAll', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }

  // ! Get Category Blog By Id
  async findOne(id: number) {
    try {
      const categoryBlog = await this.prismaService.category_blogs.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!categoryBlog) {
        throw new HttpException(
          'Không tìm thấy danh mục blog',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          data: categoryBlog,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.findOne', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }

  // ! Get Category Blog By Slug
  async findOneBySlug(slug: string) {
    try {
      const categoryBlog = await this.prismaService.category_blogs.findUnique({
        where: {
          slug,
        },
      });
      if (!categoryBlog) {
        throw new HttpException(
          'Không tìm thấy danh mục blog',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          data: categoryBlog,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.findOneBySlug', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }

  // ! Update Category Blog
  async update(
    id: number,
    updateCategoryBlogDto: UpdateCategoryBlogDto,
    files: { images?: Express.Multer.File[] },
  ) {
    try {
      const { name, description, short_description } = updateCategoryBlogDto;
      const slug = MakeSlugger(name);

      // ? Check category blog exist except this id
      const findCategoryBySlug =
        await this.prismaService.category_blogs.findFirst({
          where: { slug, NOT: { id: Number(id) } },
        });

      if (findCategoryBySlug) {
        throw new HttpException(
          'Tên danh mục đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // ? Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/category_blogs',
        );

      if (!uploadImages) {
        throw new HttpException('Upload ảnh thất bại', HttpStatus.BAD_REQUEST);
      }

      // ? Update category blog
      const updateCategoryBlog = await this.prismaService.category_blogs.update(
        {
          where: { id: Number(id) },
          data: {
            name,
            slug,
            description,
            short_description,
            images: uploadImages as any,
          },
        },
      );

      throw new HttpException(
        {
          message: 'Cập nhật danh mục blog thành công',
          data: updateCategoryBlog,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.update', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }

  // ! Soft Delete Category Blog
  async softDelete(reqUser, id: number) {
    try {
      const findCategoryBlog =
        await this.prismaService.category_blogs.findUnique({
          where: { id: Number(id) },
        });

      if (!findCategoryBlog) {
        throw new HttpException(
          'Không tìm thấy danh mục blog',
          HttpStatus.NOT_FOUND,
        );
      }

      const softDeleteCategoryBlog =
        await this.prismaService.category_blogs.update({
          where: { id: Number(id) },
          data: {
            deleted_at: new Date(),
            deleted: true,
            deleted_by: reqUser.id,
          },
        });

      throw new HttpException(
        {
          message: 'Xóa danh mục blog thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.softDelete', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }

  // ! Restore Category Blog
  async restore(id: number) {
    try {
      const findCategoryBlog =
        await this.prismaService.category_blogs.findUnique({
          where: { id: Number(id) },
        });

      if (!findCategoryBlog) {
        throw new HttpException(
          'Không tìm thấy danh mục blog',
          HttpStatus.NOT_FOUND,
        );
      }

      const restoreCategoryBlog =
        await this.prismaService.category_blogs.update({
          where: { id: Number(id) },
          data: {
            deleted_at: null,
            deleted: false,
            deleted_by: null,
          },
        });

      throw new HttpException(
        {
          message: 'Khôi phục danh mục blog thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.restore', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }

  // ! Delete Category Blog
  async destroy(id: number) {
    try {
      // ? Check category blog exist
      const findCategoryBlog =
        await this.prismaService.category_blogs.findUnique({
          where: { id: Number(id) },
        });

      if (!findCategoryBlog) {
        throw new HttpException(
          'Không tìm thấy danh mục blog',
          HttpStatus.NOT_FOUND,
        );
      }

      // ? Check category blog have soft delete or not
      if (findCategoryBlog.deleted) {
        throw new HttpException(
          'Danh mục blog phải xóa mềm trước',
          HttpStatus.BAD_REQUEST,
        );
      }

      // ? Check category blog have blogs
      const findBlogs = await this.prismaService.blogs.findMany({
        where: { category_blog_id: Number(id) },
      });

      if (findBlogs.length > 0) {
        // ? Delete blogs
        await this.prismaService.blogs.deleteMany({
          where: { category_blog_id: Number(id) },
        });
      }

      // ? Delete category blog
      await this.prismaService.category_blogs.delete({
        where: { id: Number(id) },
      });

      throw new HttpException(
        {
          message:
            'Xóa vĩnh viễn danh mục blog và các bài viết liên quan thành công',
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ categoryBlogsService.delete', error);
      throw new InternalServerErrorException('Lỗi server vui lòng thử lại sau');
    }
  }
}
