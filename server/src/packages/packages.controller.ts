import { find } from 'rxjs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { isPublic } from 'decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('packages')
@ApiTags('Packages - Quản lý gói')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // ! Create package
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
      message: 'Tạo gói thành công',
      data: {
        id: 1,
        name: 'Gói 1',
        party_type_id: 1,
        menu_id: 1,
        decor_id: 1,
        price: 100000,
        description: 'Mô tả gói 1',
        short_description: 'Mô tả ngắn gọn gói 1',
        slug: 'goi-1',
        images: [
          'http://localhost:3000/images/1.jpg',
          'http://localhost:3000/images/2.jpg',
        ],
        extra_service: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
        created_at: '2021-06-29T07:34:00.000Z',
        updated_at: '2021-06-29T07:34:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên gói đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Tạo gói' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        if (!file) {
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
          if (f.size > 1024 * 1024 * 5) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 5MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createPackageDto: CreatePackageDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.packagesService.create(createPackageDto, files);
  }

  // ! Get all packages
  @Get('get-all')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: [
      {
        id: 1,
        name: 'Gói 1',
        party_type_id: 1,
        menu_id: 1,
        decor_id: 1,
        price: 100000,
        description: 'Mô tả gói 1',
        short_description: 'Mô tả ngắn gọn gói 1',
        slug: 'goi-1',
        images: [
          'http://localhost:3000/images/1.jpg',
          'http://localhost:3000/images/2.jpg',
        ],
        extra_service: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
        created_at: '2021-06-29T07:34:00.000Z',
        updated_at: '2021-06-29T07:34:00.000Z',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy tất cả gói' })
  findAll() {
    return this.packagesService.findAll();
  }

  // ! Get All Packages deleted
  @Get('get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: [
      {
        id: 1,
        name: 'Gói 1',
        party_type_id: 1,
        menu_id: 1,
        decor_id: 1,
        price: 100000,
        description: 'Mô tả gói 1',
        short_description: 'Mô tả ngắn gọn gói 1',
        slug: 'goi-1',
        images: [
          'http://localhost:3000/images/1.jpg',
          'http://localhost:3000/images/2.jpg',
        ],
        extra_service: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
        created_at: '2021-06-29T07:34:00.000Z',
        updated_at: '2021-06-29T07:34:00.000Z',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy tất cả gói đã xóa' })
  findAllDeleted() {
    return this.packagesService.findAllDeleted();
  }
  // ! Get package by ID
  @Get('get/:id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 1,
      name: 'Gói 1',
      party_type_id: 1,
      menu_id: 1,
      decor_id: 1,
      price: 100000,
      description: 'Mô tả gói 1',
      short_description: 'Mô tả ngắn gọn gói 1',
      slug: 'goi-1',
      images: [
        'http://localhost:3000/images/1.jpg',
        'http://localhost:3000/images/2.jpg',
      ],
      extra_service: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ],
      created_at: '2021-06-29T07:34:00.000Z',
      updated_at: '2021-06-29T07:34:00.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy gói',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy gói theo ID' })
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  // ! Get Package by slug
  @Get('get-by-slug/:slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 1,
      name: 'Gói 1',
      party_type_id: 1,
      menu_id: 1,
      decor_id: 1,
      price: 100000,
      description: 'Mô tả gói 1',
      short_description: 'Mô tả ngắn gọn gói 1',
      slug: 'goi-1',
      images: [
        'http://localhost:3000/images/1.jpg',
        'http://localhost:3000/images/2.jpg',
      ],
      extra_service: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ],
      created_at: '2021-06-29T07:34:00.000Z',
      updated_at: '2021-06-29T07:34:00.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy gói',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy gói theo slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.packagesService.findBySlug(slug);
  }

  // ! Update package
  @Patch('update/:id')
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
      message: 'Cập nhật gói thành công',
      data: {
        id: 1,
        name: 'Gói 1',
        party_type_id: 1,
        menu_id: 1,
        decor_id: 1,
        price: 100000,
        description: 'Mô tả gói 1',
        short_description: 'Mô tả ngắn gọn gói 1',
        slug: 'goi-1',
        images: [
          'http://localhost:3000/images/1.jpg',
          'http://localhost:3000/images/2.jpg',
        ],
        extra_service: [
          { id: 1, quantity: 2 },
          { id: 2, quantity: 1 },
        ],
        created_at: '2021-06-29T07:34:00.000Z',
        updated_at: '2021-06-29T07:34:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên gói đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy gói',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Cập nhật gói' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
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
          if (f.size > 1024 * 1024 * 5) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 5MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updatePackageDto: CreatePackageDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.packagesService.update(+id, updatePackageDto, files);
  }

  // ! Soft delete package
  @Delete('delete/:id')
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
      message: 'Xóa gói thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy gói',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa gói tạm thời' })
  remove(@Request() req, @Param('id') id: string) {
    return this.packagesService.remove(+id, req.user);
  }

  // ! Restore package
  @Patch('restore/:id')
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
      message: 'Khôi phục gói thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy gói',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục gói' })
  restore(@Param('id') id: string) {
    return this.packagesService.restore(+id);
  }

  // ! Delete package
  @Delete('/destroy/:id')
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
      message: 'Xóa gói thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy gói',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa gói vĩnh viễn' })
  destroy(@Param('id') id: string) {
    return this.packagesService.destroy(+id);
  }
}
