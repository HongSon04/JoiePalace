import { menus } from './../../node_modules/.prisma/client/index.d';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  HttpStatus,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { isPublic } from 'decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';
import { FilterBookingDto } from './dto/FilterBookingDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { DeleteMultipleImagesByUrlDto } from './dto/delete-multi-image.dto';

@ApiTags('Bookings - Quản lý đơn tiệc')
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ! Create Booking
  @isPublic()
  @Post('create')
  @ApiOperation({ summary: 'Tạo mới một đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo đơn tiệc thành công',
      data: {
        id: 1,
        user_id: 1,
        branch_id: 1,
        stage_id: 1,
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'nguyenvana@example.com',
        company_name: 'Công ty ABC',
        note: 'Yêu cầu đặc biệt',
        shift: 'Sáng',
        number_of_guests: 100,
        budget: 'Trên 500 triệu',
        organization_date: '2024-09-20T08:00:00.000Z',
        is_confirm: false,
        is_deposit: false,
        status: 'pending',
        expired_at: '2024-09-23T08:00:00.000Z',
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        booking_details: {
          id: 1,
          booking_id: 1,
          decor_id: 1,
          menu_id: 1,
          deposit_id: 1,
          table_count: 10,
          table_price: 100000,
          chair_count: 50,
          chair_price: 50000,
          spare_table_count: 5,
          spare_table_price: 20000,
          spare_chair_count: 10,
          spare_chair_price: 10000,
          party_types: {},
          decor: {},
          menu: {},
          extra_service: {},
          gift: {},
          images: ['image1.jpg', 'image2.jpg'],
          amount_booking: 1,
          fee: 10000,
          total_amount: 1000000,
          created_at: '2024-09-20T09:51:29.458Z',
          updated_at: '2024-09-20T09:51:29.458Z',
        },
        users: {
          id: 1,
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Đã có sự kiện tổ chức vào thời gian này',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  // ! Get All Booking
  @Get('get-all')
  @isPublic()
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Lấy danh sách đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 1,
          user_id: 1,
          branch_id: 1,
          stage_id: 1,
          name: 'Nguyễn Văn A',
          phone: '0123456789',
          email: 'nguyenvana@example.com',
          company_name: 'Công ty ABC',
          note: 'Yêu cầu đặc biệt',
          shift: 'Sáng',
          number_of_guests: 100,
          budget: 'Trên 500 triệu',
          organization_date: '2024-09-20T08:00:00.000Z',
          is_confirm: false,
          is_deposit: false,
          status: 'pending',
          expired_at: '2024-09-23T08:00:00.000Z',
          created_at: '2024-09-20T09:51:29.458Z',
          updated_at: '2024-09-20T09:51:29.458Z',
          booking_details: {
            id: 1,
            booking_id: 1,
            decor_id: 1,
            menu_id: 1,
            deposit_id: 1,
            table_count: 10,
            table_price: 100000,
            chair_count: 50,
            chair_price: 50000,
            spare_table_count: 5,
            spare_table_price: 20000,
            spare_chair_count: 10,
            spare_chair_price: 10000,
            party_types: {},
            decor: {},
            menu: {},
            extra_service: {},
            gift: {},
            images: ['image1.jpg', 'image2.jpg'],
            amount_booking: 1,
            fee: 10000,
            total_amount: 1000000,
            created_at: '2024-09-20T09:51:29.458Z',
            updated_at: '2024-09-20T09:51:29.458Z',
          },
          users: {
            id: 1,
            username: 'nguyenvana',
            email: 'nguyenvana@example.com',
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy dữ liệu',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'branch_id', required: false, description: '1' })
  @ApiQuery({ name: 'stage_id', required: false, description: '1' })
  @ApiQuery({ name: 'party_type_id', required: false, description: '1' })
  @ApiQuery({ name: 'decor_id', required: false, description: '1' })
  @ApiQuery({ name: 'menu_id', required: false, description: '1' })
  @ApiQuery({ name: 'user_id', required: false, description: '1' })
  @ApiQuery({ name: 'deposit_id', required: false, description: '1' })
  @ApiQuery({ name: 'deleted', required: false, description: 'true | false' })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      '["pending", "processing", "success", "cancel"] || pending || processing || success || cancel',
  })
  @ApiQuery({
    name: 'is_confirm',
    required: false,
    description: 'true | false',
  })
  @ApiQuery({
    name: 'is_deposit',
    required: false,
    description: 'true | false',
  })
  findAll(@Query() query: FilterBookingDto) {
    return this.bookingsService.findAll(query);
  }

  // ! Get One Booking
  @Get('get/:booking_id')
  @isPublic()
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 1,
        user_id: 1,
        branch_id: 1,
        stage_id: 1,
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'nguyenvana@example.com',
        company_name: 'Công ty ABC',
        note: 'Yêu cầu đặc biệt',
        shift: 'Sáng',
        number_of_guests: 100,
        budget: 'Trên 500 triệu',
        organization_date: '2024-09-20T08:00:00.000Z',
        is_confirm: false,
        is_deposit: false,
        status: 'pending',
        expired_at: '2024-09-23T08:00:00.000Z',
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        booking_details: {
          id: 1,
          booking_id: 1,
          decor_id: 1,
          menu_id: 1,
          deposit_id: 1,
          table_count: 10,
          table_price: 100000,
          chair_count: 50,
          chair_price: 50000,
          spare_table_count: 5,
          spare_table_price: 20000,
          spare_chair_count: 10,
          spare_chair_price: 10000,
          party_types: {},
          decor: {},
          menu: {},
          extra_service: {},
          gift: {},
          images: ['image1.jpg', 'image2.jpg'],
          amount_booking: 1,
          fee: 10000,
          total_amount: 1000000,
          created_at: '2024-09-20T09:51:29.458Z',
          updated_at: '2024-09-20T09:51:29.458Z',
        },
        users: {
          id: 1,
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy dữ liệu',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  findOne(@Param('booking_id') id: number) {
    return this.bookingsService.findOne(id);
  }

  // ! Get Booking For Next 14 Days
  @Get('get-booking-list/:branch_id')
  @ApiOperation({
    summary:
      'Lấy danh sách đơn tiệc trong 14 ngày tới (dành cho clients sau dữ liệu booking)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách đơn tiệc thành công',
      data: {
        success: true,
        data: [
          {
            id: null,
            name: null,
            organization_date: '16-11-2024',
            shift: 'Sáng',
            status: false,
            stages: [
              {
                id: 10,
                name: 'Stage 2',
                status: false,
              },
            ],
          },
          {
            id: null,
            name: null,
            organization_date: '16-11-2024',
            shift: 'Tối',
            status: false,
            stages: [
              {
                id: 10,
                name: 'Stage 2',
                status: false,
              },
            ],
          },
          {
            id: null,
            name: null,
            organization_date: '17-11-2024',
            shift: 'Sáng',
            status: false,
            stages: [
              {
                id: 10,
                name: 'Stage 2',
                status: false,
              },
            ],
          },
          {
            id: null,
            name: null,
            organization_date: '17-11-2024',
            shift: 'Tối',
            status: false,
            stages: [
              {
                id: 10,
                name: 'Stage 2',
                status: false,
              },
            ],
          },
          {
            id: null,
            name: null,
            organization_date: '18-11-2024',
            shift: 'Sáng',
            status: false,
            stages: [
              {
                id: 10,
                name: 'Stage 2',
                status: false,
              },
            ],
          },
          {
            id: null,
            name: null,
            organization_date: '18-11-2024',
            shift: 'Tối',
            status: false,
            stages: [
              {
                id: 10,
                name: 'Stage 2',
                status: false,
              },
            ],
          },
        ],
        message: 'Lấy dữ liệu đặt chỗ thành công!',
      },
    },
  })
  @isPublic()
  getNext7Days(@Param('branch_id') branch_id: string) {
    return this.bookingsService.getBookingForNext14Days(+branch_id);
  }

  // ! Update Booking
  @Patch('update/:booking_id')
  @ApiOperation({
    summary: 'Cập nhật thông tin một đơn tiệc',
    description: `Cách tính tổng tiền tiệc:
Bàn: 200k/1 (1 bàn = 10 ghế, 1 bàn = 1 menu)
Ghế: 50k/1 
orther service: lấy giá của ID * quantity (điền các cặp id value như là nước bánh kem, MC)
extra service: như trên nhưng chỉ điền khi is_deposit = true thì điền 

Tổng tiền bàn + tổng tiền ghế + tiền trang trí (decor) + tiền loại tiệc+ tiền sảnh (stages) + tổng tiền menu + tổng tiền bàn dự phòng + tổng tiền ghế dự phòng + tổng tiền dịch vụ khác + tổng tiền dịch vụ them = Tổng tiền (amount)

Phí sẽ là 10% (không cần + vô tổng tiền)

amount sẽ gửi lên BE check trùng giá thì pass`,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật đơn tiệc thành công',
      data: {
        id: 1,
        user_id: 1,
        branch_id: 1,
        stage_id: 1,
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'nguyenvana@example.com',
        company_name: 'Công ty ABC',
        note: 'Yêu cầu đặc biệt',
        shift: 'Sáng',
        number_of_guests: 100,
        budget: 'Trên 500 triệu',
        organization_date: '2024-09-20T08:00:00.000Z',
        is_confirm: false,
        is_deposit: false,
        status: 'pending',
        expired_at: '2024-09-23T08:00:00.000Z',
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        booking_details: {
          id: 1,
          booking_id: 1,
          decor_id: 1,
          menu_id: 1,
          deposit_id: 1,
          table_count: 10,
          table_price: 100000,
          chair_count: 50,
          chair_price: 50000,
          spare_table_count: 5,
          spare_table_price: 20000,
          spare_chair_count: 10,
          spare_chair_price: 10000,
          party_types: {},
          decor: {},
          menu: {},
          extra_service: {},
          gift: {},
          images: ['image1.jpg', 'image2.jpg'],
          amount_booking: 1,
          fee: 10000,
          total_amount: 1000000,
          created_at: '2024-09-20T09:51:29.458Z',
          updated_at: '2024-09-20T09:51:29.458Z',
        },
        users: {
          id: 1,
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy đơn đặt tiệc',
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      fileFilter: (req, file, cb) => {
        if (!file || req.files.images.length === 0) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 10) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 10 ảnh'),
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
    @Request() req,
    @Param('booking_id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.bookingsService.update(req.user, id, updateBookingDto, files);
  }

  // ! Update Status Booking
  @Patch('update-status/:booking_id')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật trạng thái đơn tiệc thành công',
      data: {
        id: 1,
        user_id: 1,
        branch_id: 1,
        stage_id: 1,
        name: 'Nguyễn Văn A',
        phone: '0123456789',
        email: 'nguyenvana@example.com',
        company_name: 'Công ty ABC',
        note: 'Yêu cầu đặc biệt',
        shift: 'Sáng',
        number_of_guests: 100,
        budget: 'Trên 500 triệu',
        organization_date: '2024-09-20T08:00:00.000Z',
        is_confirm: false,
        is_deposit: false,
        status: 'pending',
        expired_at: '2024-09-23T08:00:00.000Z',
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        booking_details: {
          id: 1,
          booking_id: 1,
          decor_id: 1,
          menu_id: 1,
          deposit_id: 1,
          table_count: 10,
          table_price: 100000,
          chair_count: 50,
          chair_price: 50000,
          spare_table_count: 5,
          spare_table_price: 20000,
          spare_chair_count: 10,
          spare_chair_price: 10000,
          party_types: {},
          decor: {},
          menu: {},
          extra_service: {},
          gift: {},
          images: ['image1.jpg', 'image2.jpg'],
          amount_booking: 1,
          fee: 10000,
          total_amount: 1000000,
          created_at: '2024-09-20T09:51:29.458Z',
          updated_at: '2024-09-20T09:51:29.458Z',
        },
        users: {
          id: 1,
          username: 'nguyenvana',
          email: 'nguyenvana@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy đơn đặt tiệc',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  updateStatus(
    @Param('booking_id') id: number,
    @Body() updateStatusBookingDto: UpdateStatusBookingDto,
  ) {
    return this.bookingsService.updateStatus(id, updateStatusBookingDto);
  }

  // ! Soft Delete Booking
  @Delete('delete/:booking_id')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Xóa tạm thời một đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa tạm thời đơn tiệc thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy đơn tiệc',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  delete(@Request() req, @Param('booking_id') id: number) {
    return this.bookingsService.delete(req.user, id);
  }

  // ! Restore Booking
  @Patch('restore/:booking_id')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Khôi phục một đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục đơn tiệc thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy đơn tiệc',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      error: 'Lỗi gì đó !',
    },
  })
  restore(@Param('booking_id') id: number) {
    return this.bookingsService.restore(id);
  }

  // ! Hard Delete Booking
  @Delete('hard-delete/:booking_id')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Xóa vĩnh viễn một đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn đơn tiệc thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy đơn tiệc',
    },
  })
  destroy(@Param('booking_id') id: number) {
    return this.bookingsService.destroy(id);
  }

  // ! Delete Multiple Images By Url
  @Delete('delete-multiple-images')
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Xóa nhiều ảnh theo url' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa ảnh thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy ảnh',
    },
  })
  deleteMultipleImageByUrl(@Body() body: DeleteMultipleImagesByUrlDto) {
    return this.bookingsService.deleteMultipleImageByUrl(body);
  }
}
