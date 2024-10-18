import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MakeSlugger } from 'helper/slug';
import { FilterDto } from 'helper/dto/Filter.dto';

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
        category_blog_id,
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
      const existingCategory =
        await this.prismaService.category_blogs.findFirst({
          where: { id: Number(category_blog_id) },
        });

      if (!existingCategory) {
        throw new HttpException(
          'Danh mục không tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check tags existence
      const existingTags = (await this.prismaService.tags.findMany({
        where: { id: { in: tags } },
      })) as any;

      if (existingTags.length !== tags.length) {
        throw new HttpException('Tag không tồn tại', HttpStatus.BAD_REQUEST);
      }

      // Upload images
      // Upload images
      const uploadImages =
        await this.cloudinaryService.uploadMultipleFilesToFolder(
          files.images,
          'joiepalace/blogs',
        );

      if (!uploadImages) {
        throw new HttpException('Upload ảnh thất bại', HttpStatus.BAD_REQUEST);
      }

      // Create blog entry
      const tagsConnect = existingTags.map((tag) => ({ id: Number(Number(tag.id)) }));

      const createBlog = await this.prismaService.blogs.create({
        data: {
          title,
          slug,
          content,
          description,
          short_description,
          category_blog_id,
          tags: {
            connect: tagsConnect,
          },
          images: uploadImages as any,
        },
      });

      throw new HttpException(
        { message: 'Tạo bài viết thành công', data: createBlog },
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> create', error);
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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
        title: {
          contains: search,
          mode: 'insensitive',
        },
        description: {
          contains: search,
          mode: 'insensitive',
        },
        slug: {
          contains: search,
          mode: 'insensitive',
        },
        short_description: {
          contains: search,
          mode: 'insensitive',
        },
      };

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
          include: {
            tags: true,
            category_blogs: true,
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
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAll', error);
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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
        title: {
          contains: search,
          mode: 'insensitive',
        },
        description: {
          contains: search,
          mode: 'insensitive',
        },
        slug: {
          contains: search,
          mode: 'insensitive',
        },
        short_description: {
          contains: search,
          mode: 'insensitive',
        },
      };

      const [res, total] = await Promise.all([
        this.prismaService.blogs.findMany({
          where: whereConditions,
          skip,
          take: itemsPerPage,
          include: {
            tags: true,
            category_blogs: true,
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
          data: res,
          pagination: paginationInfo,
        },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findAllDeleted', error);
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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
          category_blogs: true,
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
          views: blog.views + 1,
        },
      });

      throw new HttpException({ data: blog }, HttpStatus.OK);
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
          category_blogs: true,
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
          views: blog.views + 1,
        },
      });

      throw new HttpException({ data: blog }, HttpStatus.OK);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> findOneBySlug', error);
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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
        category_blog_id,
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
      const existingCategory =
        await this.prismaService.category_blogs.findFirst({
          where: { id: Number(category_blog_id) },
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

      if (existingSlug && existingSlug.id !== id) {
        throw new HttpException(
          'Tên bài viết đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check tags existence
      const existingTags = (await this.prismaService.tags.findMany({
        where: { id: { in: tags } },
      })) as any;

      if (existingTags.length !== tags.length) {
        throw new HttpException('Tag không tồn tại', HttpStatus.BAD_REQUEST);
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

      // Create blog entry
      const tagsConnect = existingTags.map((tag) => ({ id: Number(Number(tag.id)) }));

      const updateBlog = await this.prismaService.blogs.update({
        where: { id: Number(id) },
        data: {
          title,
          slug,
          content,
          description,
          short_description,
          category_blog_id,
          tags: {
            connect: tagsConnect,
          },
          images: uploadImages as any,
        },
      });

      throw new HttpException(
        { message: 'Cập nhật bài viết thành công', data: updateBlog },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> update', error);
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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
        category_blog_id,
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
      const existingCategory =
        await this.prismaService.category_blogs.findFirst({
          where: { id: Number(category_blog_id) },
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

      if (existingSlug && existingSlug.id !== existingBlog.id) {
        throw new HttpException(
          'Tên bài viết đã tồn tại',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check tags existence
      const existingTags = (await this.prismaService.tags.findMany({
        where: { id: { in: tags } },
      })) as any;

      if (existingTags.length !== tags.length) {
        throw new HttpException('Tag không tồn tại', HttpStatus.BAD_REQUEST);
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

      // Create blog entry
      const tagsConnect = existingTags.map((tag) => ({ id: Number(Number(tag.id)) }));

      const updateBlog = await this.prismaService.blogs.update({
        where: { id: Number(existingBlog.id) },
        data: {
          title,
          slug: newSlug,
          content,
          description,
          short_description,
          category_blog_id,
          tags: {
            connect: tagsConnect,
          },
          images: uploadImages as any,
        },
      });

      throw new HttpException(
        { message: 'Cập nhật bài viết thành công', data: updateBlog },
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ blogs.service.ts -> updateBySlug', error);
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
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

      if (blog.deleted) {
        throw new HttpException(
          'Bài viết phải được xóa mềm trước',
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
      throw new InternalServerErrorException('Lỗi server, vui lòng thử lại!');
    }
  }
}
