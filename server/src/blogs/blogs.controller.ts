import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFiles,
  Query,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterDto } from 'helper/dto/Filter.dto';
import { isPublic } from 'decorator/auth.decorator';

@ApiTags('Blogs - Quản lý bài viết')
@Controller('/api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ! Create a new blog
  @Post('create')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo bài viết mới thành công !',
      data: {
        id: 'number',
        title: 'string',
        slug: 'string',
        content: 'string',
        images: 'string',
        deleted: 'boolean',
        deleted_at: 'date',
        deleted_by: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tiêu đề không được để trống',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Tạo bài viết mới' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        if (!file || req.files.images.length === 0) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 6) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 6 ảnh'),
            false,
          );
        }
        for (const f of files) {
          if (!f.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
              false,
            );
          }
          if (f.size > 1024 * 1024 * 10) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 10MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.blogsService.create(createBlogDto, files);
  }

  // ! Get all blogs
  @Get('get-all')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          title: 'string',
          slug: 'string',
          content: 'string',
          images: 'string',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query: FilterDto) {
    return this.blogsService.findAll(query);
  }

  // ! Get all blogs deleted
  @Get('get-all-deleted')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          title: 'string',
          slug: 'string',
          content: 'string',
          images: 'string',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách bài viết đã xóa' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllDeleted(@Query() query: FilterDto) {
    return this.blogsService.findAllDeleted(query);
  }

  // ! Get all blogs by category
  @Get('get-all-by-category/:category_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          title: 'string',
          slug: 'string',
          content: 'string',
          images: 'string',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy danh mục !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách bài viết theo danh mục' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllByCategory(
    @Param('category_id') category_id: string,
    @Query() query: FilterDto,
  ) {
    return this.blogsService.findAllByCategory(category_id, query);
  }

  // ! Get all blogs by slug category
  @Get('get-all-by-slug-category/:category_slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          title: 'string',
          slug: 'string',
          content: 'string',
          images: 'string',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy danh mục !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách bài viết theo slug danh mục' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllBySlugCategory(
    @Param('category_slug') slug: string,
    @Query() query: FilterDto,
  ) {
    return this.blogsService.findAllBySlugCategory(slug, query);
  }

  // ! Get all blogs by tag
  @Get('get-all-by-tag/:tag_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          title: 'string',
          slug: 'string',
          content: 'string',
          images: 'string',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy tag !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách bài viết theo tag' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllByTag(@Param('tag_id') tag_id: string, @Query() query: FilterDto) {
    return this.blogsService.findAllByTag(tag_id, query);
  }

  // ! Get all blogs by slug tag
  @Get('get-all-by-slug-tag/:tag_slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          title: 'string',
          slug: 'string',
          content: 'string',
          images: 'string',
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        totalItems: 'number',
        totalPages: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy tag !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách bài viết theo slug tag' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllBySlugTag(@Param('tag_slug') slug: string, @Query() query: FilterDto) {
    return this.blogsService.findAllBySlugTag(slug, query);
  }

  // ! Get a blog by id
  @Get('get/:blog_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        title: 'string',
        slug: 'string',
        content: 'string',
        images: 'string',
        deleted: 'boolean',
        deleted_at: 'date',
        deleted_by: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy bài viết !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy bài viết theo id' })
  findOne(@Param('blog_id') id: string) {
    return this.blogsService.findOne(+id);
  }

  // ! Get a blog by slug
  @Get('get-by-slug/:blog_slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        title: 'string',
        slug: 'string',
        content: 'string',
        images: 'string',
        deleted: 'boolean',
        deleted_at: 'date',
        deleted_by: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy bài viết !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Lấy bài viết theo slug' })
  findOneBySlug(@Param('blog_slug') slug: string) {
    return this.blogsService.findOneBySlug(slug);
  }

  // ! Update a blog by id
  @Patch('update/:blog_id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        if (!file || req.files.images.length === 0) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 6) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 6 ảnh'),
            false,
          );
        }
        for (const f of files) {
          if (!f.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
              false,
            );
          }
          if (f.size > 1024 * 1024 * 10) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 10MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật bài viết thành công !',
      data: {
        id: 'number',
        title: 'string',
        slug: 'string',
        content: 'string',
        images: 'string',
        deleted: 'boolean',
        deleted_at: 'date',
        deleted_by: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy bài viết !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Cập nhật bài viết theo id' })
  update(
    @Param('blog_id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.blogsService.update(+id, updateBlogDto, files);
  }

  // ! Update a blog by slug
  @Patch('update-by-slug/:blog_slug')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        if (!file || req.files.images.length === 0) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 6) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 6 ảnh'),
            false,
          );
        }
        for (const f of files) {
          if (!f.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
              false,
            );
          }
          if (f.size > 1024 * 1024 * 10) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 10MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật bài viết thành công !',
      data: {
        id: 'number',
        title: 'string',
        slug: 'string',
        content: 'string',
        images: 'string',
        deleted: 'boolean',
        deleted_at: 'date',
        deleted_by: 'number',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy bài viết !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Cập nhật bài viết theo slug' })
  updateBySlug(
    @Param('blog_slug') slug: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.blogsService.updateBySlug(slug, updateBlogDto, files);
  }

  // ! Soft delete a blog by id
  @Delete('delte/:blog_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa bài viết thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy bài viết !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Xóa bài viết theo id' })
  delete(@Request() req, @Param('blog_id') id: string) {
    return this.blogsService.delete(req.user, +id);
  }

  // ! Restore a blog by id
  @Patch('restore/:blog_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục bài viết thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy bài viết !',
    },
  })
  @ApiOperation({ summary: 'Khôi phục bài viết theo id' })
  restore(@Param('blog_id') id: string) {
    return this.blogsService.restore(+id);
  }

  // ! Hard delete a blog by id
  @Delete('hard-delete/:blog_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn bài viết thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy bài viết !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra !',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn bài viết theo id' })
  hardDelete(@Param('blog_id') id: string) {
    return this.blogsService.hardDelete(+id);
  }
}
