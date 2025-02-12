import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/FilterCategoryDto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories - Quản lý danh mục')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ! Add Category
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
      message: 'Tạo danh mục mới thành công !',
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
      message: 'Tên danh mục đã tồn tại !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Tạo danh mục mới' })
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
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.categoriesService.create(createCategoryDto, files);
  }

  // ! Get All Category
  @Get('/get-all')
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
        total: 'number',
        prevPage: 'number',
        nextPage: 'number',
        lastPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Lấy tất cả danh mục' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'deleted', required: false, description: 'true | false' })
  findAll(@Query() query: FilterCategoryDto) {
    return this.categoriesService.findAll(query);
  }

  // ! Get Category By Id
  @Get('get/:category_id')
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
      message: 'Không tìm thấy danh mục !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  findOne(@Param('category_id') id: number) {
    return this.categoriesService.findOne(id);
  }

  // ! Get Category By Slug
  @Get('get-by-slug/:category_slug')
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
      message: 'Không tìm thấy danh mục !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo slug' })
  findOneBySlug(@Param('category_slug') slug: string) {
    return this.categoriesService.findOneBySlug(slug);
  }

  // ! Get Category by Tag Slug
  @Get('get-by-tag-slug/:tag_slug')
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
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy danh mục !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Lấy danh mục theo tag slug' })
  findOneByTagSlug(@Param('tag_slug') tag_slug: string) {
    return this.categoriesService.findCategoryByTagSlug(tag_slug);
  }

  // ! Update Category
  @Patch('update/:category_id')
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
      message: 'Cập nhật thông tin danh mục thành công !',
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
  @ApiOperation({ summary: 'Cập nhật thông tin danh mục' })
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
  update(
    @Param('category_id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.categoriesService.update(id, updateCategoryDto, files);
  }

  // ! Delete Category
  @Delete('delete/:category_id')
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
      message: 'Xóa danh mục thành công !',
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
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm thời danh mục' })
  softDelete(@Request() req, @Param('category_id') id: number) {
    return this.categoriesService.softDelete(req.user, id);
  }

  // ! Restore Category
  @Put('restore/:category_id')
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
      message: 'Khôi phục danh mục thành công',
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
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Khôi phục danh mục đã xóa' })
  restore(@Param('category_id') id: number) {
    return this.categoriesService.restore(id);
  }

  // ! Delete Category
  @Delete('destroy/:category_id')
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
      message: 'Xóa vĩnh viễn danh mục thành công !',
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
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn danh mục' })
  remove(@Param('category_id') id: number) {
    return this.categoriesService.destroy(id);
  }
}
