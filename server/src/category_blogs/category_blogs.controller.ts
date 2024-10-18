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
  Request,
  Query,
} from '@nestjs/common';
import { CategoryBlogsService } from './category_blogs.service';
import { CreateCategoryBlogDto } from './dto/create-category_blog.dto';
import { UpdateCategoryBlogDto } from './dto/update-category_blog.dto';
import {
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { isPublic } from 'decorator/auth.decorator';
import { FilterDto } from 'helper/dto/Filter.dto';

@Controller('/api/category-blogs')
@ApiTags('Category Blogs')
export class CategoryBlogsController {
  constructor(private readonly categoryBlogsService: CategoryBlogsService) {}

  // ! Create Category Blog
  @Post('create')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo danh mục blog mới thành công !',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
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
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Tạo danh mục blog mới' })
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
    @Body() createCategoryBlogDto: CreateCategoryBlogDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.categoryBlogsService.create(createCategoryBlogDto, files);
  }

  // ! Get all category blogs
  @Get('get-all')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          description: 'string',
          short_description: 'string',
          images: ['string'],
          deleted: 'boolean',
          deleted_at: 'date',
          deleted_by: 'number',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách danh mục blog' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query: FilterDto) {
    return this.categoryBlogsService.findAll(query);
  }

  // ! Get category blog by id
  @Get('get/:blog_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: ['string'],
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
      message: 'Không tìm thấy danh mục blog !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin danh mục blog' })
  findOne(@Param('blog_id') id: string) {
    return this.categoryBlogsService.findOne(+id);
  }

  // ! Get category blog by slug
  @Get('get-by-slug/:slug')
  @isPublic()
  @ApiOperation({ summary: 'Lấy thông tin danh mục blog theo slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: ['string'],
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
      message: 'Không tìm thấy danh mục blog !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  findOneBySlug(@Param('slug') slug: string) {
    return this.categoryBlogsService.findOneBySlug(slug);
  }

  // ! Update category blog
  @Patch('update/:blog_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật danh mục blog thành công !',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
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
      message: 'Không tìm thấy danh mục blog !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Cập nhật thông tin danh mục blog' })
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
  update(
    @Param('blog_id') id: string,
    @Body() updateCategoryBlogDto: UpdateCategoryBlogDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.categoryBlogsService.update(+id, updateCategoryBlogDto, files);
  }

  // ! Soft delete category blog
  @Delete('delete/:id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa danh mục blog thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy danh mục blog !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa danh mục blog tạm thời' })
  softDelete(@Request() req, @Param('id') id: string) {
    return this.categoryBlogsService.softDelete(req.user, +id);
  }

  // ! Restore category blog
  @Patch('restore/:id')
  @ApiOperation({ summary: 'Khôi phục danh mục blog đã xóa' })
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục danh mục blog thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy danh mục blog !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  restore(@Param('id') id: string) {
    return this.categoryBlogsService.restore(+id);
  }

  // ! Delete category blog
  @Delete('destroy/:id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn danh mục blog thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy danh mục blog !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn danh mục blog' })
  destroy(@Param('id') id: string) {
    return this.categoryBlogsService.destroy(+id);
  }
}
