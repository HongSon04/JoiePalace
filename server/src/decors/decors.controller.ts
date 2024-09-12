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
import { DecorsService } from './decors.service';
import { CreateDecorDto, ImageDecorDto } from './dto/create-decor.dto';
import { UpdateDecorDto } from './dto/update-decor.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';

@ApiTags('decors')
@Controller('decors')
export class DecorsController {
  constructor(private readonly decorsService: DecorsService) {}

  // ! Create Decor
  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Thêm mới trang trí thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên trang trí đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Tạo trang trí' })
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
    @Body() createDecorDto: CreateDecorDto,
    @UploadedFiles() files: ImageDecorDto,
  ) {
    return this.decorsService.create(createDecorDto, files);
  }

  // ! Get All Decors
  @Get('get-all')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách trang trí thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
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
  @ApiOperation({ summary: 'Lấy danh sách trang trí' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAll(@Query() query: FilterPriceDto) {
    return this.decorsService.findAll(query);
  }

  // ! Get All Deleted Decors
  @Get('get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách trang trí đã xóa tạm thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
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
  @ApiOperation({ summary: 'Lấy danh sách trang trí đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAllDeleted(@Query() query: FilterPriceDto) {
    return this.decorsService.findAllDeleted(query);
  }

  // ! Get Decor By ID
  @Get('get/:decor_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy thông tin trang trí thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy trang trí',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin trang trí' })
  findOne(@Param('decor_id') id: number) {
    return this.decorsService.findOne(id);
  }

  // ! Get Decor By Slug
  @Get('get-by-slug/:slug')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy thông tin trang trí thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy trang trí',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin trang trí theo slug' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.decorsService.findOneBySlug(slug);
  }

  // ! Update Decor
  @Patch('update/:decor_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật trang trí thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên trang trí đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Cập nhật trang trí' })
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
    @Param('decor_id') id: number,
    @Body() updateDecorDto: UpdateDecorDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.decorsService.update(id, updateDecorDto, files);
  }

  // ! Soft Delete Decor
  @Delete('delete/:decor_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa trang trí thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy trang trí',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa trang trí' })
  remove(@Request() req, @Param('decor_id') id: number) {
    return this.decorsService.delete(req.user, id);
  }

  // ! Restore Decor
  @Patch('restore/:decor_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục trang trí thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy trang trí',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục trang trí đã xóa' })
  restore(@Param('decor_id') id: number) {
    return this.decorsService.restore(id);
  }

  // ! Hard Delete Decor
  @Delete('destroy/:decor_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn trang trí thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy trang trí',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn trang trí' })
  destroy(@Param('decor_id') id: number) {
    return this.decorsService.destroy(id);
  }
}
