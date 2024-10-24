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
  BadRequestException,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { isPublic } from 'decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('memberships')
@ApiTags('Memberships - Quản lý hạng thành viên')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  // ! Create membership
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
      message: 'Tạo hạng thành viên thành công',
      data: {
        id: 1,
        name: 'Hạng thành viên 1',
        slug: 'hang-thanh-vien-1',
        description: 'Mô tả hạng thành viên 1',
        images: [
          'http://localhost:3000/images/memberships/1/1.jpg',
          'http://localhost:3000/images/memberships/1/2.jpg',
          'http://localhost:3000/images/memberships/1/3.jpg',
        ],
        created_at: '2021-10-14T07:02:52.000Z',
        updated_at: '2021-10-14T07:02:52.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      statusCode: 400,
      message: 'Tên hạng thành viên đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      statusCode: 500,
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Tạo hạng thành viên' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      fileFilter: (req, file, cb) => {
        // Kiểm tra xem file có tồn tại không
        if (!file) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }

        // Kiểm tra định dạng tệp
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
            false,
          );
        }

        // Kiểm tra kích thước tệp
        if (file.size > 1024 * 1024 * 5) {
          return cb(
            new BadRequestException('Kích thước ảnh tối đa 5MB'),
            false,
          );
        }

        // Nếu tất cả đều hợp lệ
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createMembershipDto: CreateMembershipDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.membershipsService.create(createMembershipDto, files);
  }

  // ! Get all memberships
  @Get('get-all')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: [
      {
        id: 1,
        name: 'Hạng thành viên 1',
        slug: 'hang-thanh-vien-1',
        description: 'Mô tả hạng thành viên 1',
        images: [
          'http://localhost:3000/images/memberships/1/1.jpg',
          'http://localhost:3000/images/memberships/1/2.jpg',
          'http://localhost:3000/images/memberships/1/3.jpg',
        ],
        created_at: '2021-10-14T07:02:52.000Z',
        updated_at: '2021-10-14T07:02:52.000Z',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({ summary: 'Lấy danh sách hạng thành viên chưa xóa tạm' })
  findAll() {
    return this.membershipsService.findAll();
  }

  // ! Get all memberships soft deleted
  @Get('get-all-deleted')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: [
      {
        id: 1,
        name: 'Hạng thành viên 1',
        slug: 'hang-thanh-vien-1',
        description: 'Mô tả hạng thành viên 1',
        images: [
          'http://localhost:3000/images/memberships/1/1.jpg',
          'http://localhost:3000/images/memberships/1/2.jpg',
          'http://localhost:3000/images/memberships/1/3.jpg',
        ],
        created_at: '2021-10-14T07:02:52.000Z',
        updated_at: '2021-10-14T07:02:52.000Z',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({ summary: 'Lấy danh sách hạng thành viên đã xóa tạm' })
  findAllDeleted() {
    return this.membershipsService.findAllDeleted();
  }

  // ! Get membership by id
  @Get('get/:membership_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 1,
      name: 'Hạng thành viên 1',
      slug: 'hang-thanh-vien-1',
      description: 'Mô tả hạng thành viên 1',
      images: [
        'http://localhost:3000/images/memberships/1/1.jpg',
        'http://localhost:3000/images/memberships/1/2.jpg',
        'http://localhost:3000/images/memberships/1/3.jpg',
      ],
      created_at: '2021-10-14T07:02:52.000Z',
      updated_at: '2021-10-14T07:02:52.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      statusCode: 404,
      message: 'Không tìm thấy hạng thành viên',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({ summary: 'Lấy hạng thành viên theo id' })
  findOne(@Param('membership_id') id: string) {
    return this.membershipsService.findOne(+id);
  }

  // ! Get membership by slug
  @Get('get-by-slug/:membership_slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 1,
      name: 'Hạng thành viên 1',
      slug: 'hang-thanh-vien-1',
      description: 'Mô tả hạng thành viên 1',
      images: [
        'http://localhost:3000/images/memberships/1/1.jpg',
        'http://localhost:3000/images/memberships/1/2.jpg',
        'http://localhost:3000/images/memberships/1/3.jpg',
      ],
      created_at: '2021-10-14T07:02:52.000Z',
      updated_at: '2021-10-14T07:02:52.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      statusCode: 404,
      message: 'Không tìm thấy hạng thành viên',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  @ApiOperation({ summary: 'Lấy hạng thành viên theo slug' })
  findOneBySlug(@Param('membership_slug') slug: string) {
    return this.membershipsService.findOneBySlug(slug);
  }

  // ! Update membership
  @Patch('update/:membership_id')
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
      message: 'Cập nhật hạng thành viên thành công',
      data: {
        id: 1,
        name: 'Hạng thành viên 1',
        slug: 'hang-thanh-vien-1',
        description: 'Mô tả hạng thành viên 1',
        images: [
          'http://localhost:3000/images/memberships/1/1.jpg',
          'http://localhost:3000/images/memberships/1/2.jpg',
          'http://localhost:3000/images/memberships/1/3.jpg',
        ],
        created_at: '2021-10-14T07:02:52.000Z',
        updated_at: '2021-10-14T07:02:52.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      statusCode: 400,
      message: 'Tên hạng thành viên đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      statusCode: 500,
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Cập nhật hạng thành viên' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      fileFilter: (req, file, cb) => {
        // Kiểm tra xem file có tồn tại không
        if (!file) {
          // Nếu không có tệp nào, cho phép tiếp tục
          return cb(null, true);
        }

        // Kiểm tra định dạng tệp
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
            false,
          );
        }

        // Kiểm tra kích thước tệp
        if (file.size > 1024 * 1024 * 5) {
          return cb(
            new BadRequestException('Kích thước ảnh tối đa 5MB'),
            false,
          );
        }

        // Nếu tất cả đều hợp lệ
        cb(null, true);
      },
    }),
  )
  update(
    @Param('membership_id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.membershipsService.update(+id, updateMembershipDto, files);
  }

  // ! Soft delete membership
  @Delete('delete/:membership_id')
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
      message: 'Xóa hạng thành viên thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      statusCode: 404,
      message: 'Không tìm thấy hạng thành viên',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      statusCode: 500,
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm thời hạng thành viên' })
  remove(@Request() req, @Param('membership_id') id: string) {
    return this.membershipsService.remove(req.user, +id);
  }

  // ! Restore membership
  @Patch('restore/:membership_id')
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
      message: 'Khôi phục hạng thành viên thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      statusCode: 404,
      message: 'Không tìm thấy hạng thành viên',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      statusCode: 500,
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục hạng thành viên' })
  restore(@Param('membership_id') id: string) {
    return this.membershipsService.restore(+id);
  }

  // ! Hard delete membership
  @Delete('hard-delete/:membership_id')
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
      message: 'Xóa hạng thành viên vĩnh viễn thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      statusCode: 404,
      message: 'Không tìm thấy hạng thành viên',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      statusCode: 500,
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn hạng thành viên' })
  hardDelete(@Param('membership_id') id: string) {
    return this.membershipsService.hardDelete(+id);
  }
}
