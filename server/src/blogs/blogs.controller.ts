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
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterDto } from 'helper/dto/Filter.dto';
import { isPublic } from 'decorator/auth.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ! Create a new blog
  @Post('create')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: true,
    },
  ])
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
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Chỉ chấp nhận ảnh jpg, jpeg, png',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(
            new HttpException(
              'Kích thước ảnh tối đa 5MB',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
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
      required: true,
    },
  ])
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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllDeleted(@Query() query: FilterDto) {
    return this.blogsService.findAllDeleted(query);
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
  @Get('get-by-slug/:slug')
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
  findOneBySlug(@Param('slug') slug: string) {
    return this.blogsService.findOneBySlug(slug);
  }

  // ! Update a blog by id
  @Patch('update/:blog_id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Chỉ chấp nhận ảnh jpg, jpeg, png',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(
            new HttpException(
              'Kích thước ảnh tối đa 5MB',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: true,
    },
  ])
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
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.blogsService.update(+id, updateBlogDto, files);
  }

  // ! Update a blog by slug
  @Patch('update-by-slug/:slug')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Chỉ chấp nhận ảnh jpg, jpeg, png',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(
            new HttpException(
              'Kích thước ảnh tối đa 5MB',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: true,
    },
  ])
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
    @Param('slug') slug: string,
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
      required: true,
    },
  ])
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
      required: true,
    },
  ])
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
  restore(@Param('blog_id') id: string) {
    return this.blogsService.restore(+id);
  }

  // ! Hard delete a blog by id
  @Delete('hard-delete/:blog_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: true,
    },
  ])
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
