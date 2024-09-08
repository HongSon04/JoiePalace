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
import { FunituresService } from './funitures.service';
import { CreateFunitureDto, ImageFunitureDto } from './dto/create-funiture.dto';
import { UpdateFunitureDto } from './dto/update-funiture.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterFunitureDto } from './dto/filter-funiture.dto';

@ApiTags('funitures')
@Controller('funitures')
export class FunituresController {
  constructor(private readonly funituresService: FunituresService) {}

  // ! Create funiture
  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Thêm mới nội thất thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
        type: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên nội thất đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Tạo nội thất' })
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
    @Body() createFunitureDto: CreateFunitureDto,
    @UploadedFiles() files: { images: ImageFunitureDto },
  ) {
    return this.funituresService.create(createFunitureDto, files);
  }

  // ! Get all funitures
  @Get('get-all')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách nội thất thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
        type: 'string',
      },
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        total: 'number',
        lastPage: 'number',
        nextPage: 'number',
        prevPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách nội thất' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'type', required: false })
  findAll(@Query() query: FilterFunitureDto) {
    return this.funituresService.findAll(query);
  }

  // ! Get All funitures by Deleted
  @Get('get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách nội thất đã xóa thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
        type: 'string',
      },
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        total: 'number',
        lastPage: 'number',
        nextPage: 'number',
        prevPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách nội thất đã xóa' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAllDeleted(@Query() query: FilterFunitureDto) {
    return this.funituresService.findAllDeleted(query);
  }

  // ! Get One funiture by ID
  @Get('get/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy nội thất thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
        type: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy nội thất',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin nội thất' })
  findOne(@Param('id') id: number) {
    return this.funituresService.findOne(id);
  }

  // ! Get One funiture by Slug
  @Get('get-slug/:slug')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy nội thất thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
        type: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy nội thất',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin nội thất' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.funituresService.findOneBySlug(slug);
  }

  // ! Update funiture
  @Patch('update/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật nội thất thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
        type: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên nội thất đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Cập nhật nội thất' })
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
    @Param('id') id: number,
    @Body() updateFunitureDto: UpdateFunitureDto,
    @UploadedFiles() files: { images: ImageFunitureDto },
  ) {
    return this.funituresService.update(id, updateFunitureDto, files);
  }

  // ! Soft delete funiture
  @Delete('delete/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa tạm nội thất thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy nội thất',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm nội thất' })
  delete(@Request() req, @Param('id') id: number) {
    return this.funituresService.delete(req.user, id);
  }

  // ! Restore funiture
  @Patch('restore/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục nội thất thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy nội thất',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục nội thất' })
  restore(@Param('id') id: number) {
    return this.funituresService.restore(id);
  }

  // ! Hard delete funiture
  @Delete('destroy/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn nội thất thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy nội thất',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn nội thất' })
  destroy(@Param('id') id: number) {
    return this.funituresService.destroy(id);
  }
}
