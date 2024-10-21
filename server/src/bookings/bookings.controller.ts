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
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { isPublic } from 'decorator/auth.decorator';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import { UpdateStatusBookingDto } from './dto/update-status-booking.dto';

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
        space_id: 1,
        stage_id: 1,
        decor_id: 1,
        menu_id: 1,
        name: 'string',
        images: ['string', 'string'],
        shift: 'Sáng',
        organization_date: '2024-09-20T08:00:00.000Z',
        amount: 1,
        fee: 1,
        total_amount: 1,
        status: 'pending',
        deleted: false,
        deleted_at: null,
        deleted_by: null,
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        users: {
          id: 1,
          username: 'string',
          email: '',
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
    },
  })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  // ! Get All Booking
  @Get('get-all')
  @ApiOperation({ summary: 'Lấy danh sách đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          user_id: 'number',
          branch_id: 'number',
          space_id: 'number',
          stage_id: 'number',
          deposit_id: 'number',
          decor_id: 'number',
          menu_id: 'number',
          name: 'string',
          images: [],
          accessories: {
            chair: {
              id: 'number',
              name: 'string',
              type: 'string',
              amount: 500,
              images: ['string', 'string'],
              quantity: 30,
              description: 'string',
              total_price: 15000,
              short_description: 'string',
            },
            table: [
              {
                id: 'number',
                name: 'string',
                type: 'string',
                amount: 500,
                images: ['string', 'string'],
                quantity: 2,
                description: 'string',
                total_price: 1000,
                short_description: 'string',
              },
              {
                id: 'number',
                name: 'string',
                type: 'table',
                amount: 500,
                images: ['string', 'string'],
                quantity: 1,
                description: 'string',
                total_price: 500,
                short_description: 'string',
              },
            ],
            total_price: 16500,
          },
          shift: 'Sáng',
          organization_date: '2024-09-20T08:00:00.000Z',
          amount: 'number',
          fee: 'number',
          total_amount: 'number',
          status: 'pending',
          deleted: false,
          deleted_at: null,
          deleted_by: null,
          created_at: '2024-09-20T09:51:29.458Z',
          updated_at: '2024-09-20T09:51:29.458Z',
          users: {
            id: 'number',
            username: 'string',
            email: 'vohongson85200@gmail.com',
            memberships_id: 'number',
            phone: '12321312312',
            avatar: null,
            role: 'admin',
          },
          branches: {
            id: 'number',
            name: 'string',
            slug: 'string',
            address: 'string',
            phone: '111111111',
            email: 'string',
            rate: 5,
            images: ['string', 'string'],
            deleted: false,
            deleted_at: null,
            deleted_by: null,
            created_at: '2024-09-18T15:32:12.458Z',
            updated_at: '2024-09-18T15:32:12.458Z',
          },
          spaces: {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: '2024-09-08T04:25:08.544Z',
            updated_at: '2024-09-08T04:25:08.544Z',
          },
          stages: {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            description: 'string',
            images: ['string', 'string'],
            capacity: 50,
            created_at: '2024-09-18T17:17:16.391Z',
            updated_at: '2024-09-18T17:17:16.391Z',
          },
          decors: {
            id: 'number',
            name: 'string',
            slug: 'trang-tri-anh',
            description: 'string',
            short_description: 'string',
            images: ['string', 'string'],
            price: 99500000,
            deleted: false,
            deleted_at: null,
            deleted_by: null,
            created_at: '2024-09-18T17:21:06.141Z',
            updated_at: '2024-09-18T17:21:06.141Z',
          },
          menus: {
            id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            price: 200000,
            is_show: true,
            deleted: false,
            deleted_at: null,
            deleted_by: null,
            created_at: '2024-09-18T16:59:25.264Z',
            updated_at: '2024-09-18T16:59:25.264Z',
          },
          deposits: {
            id: 'number',
            transactionID: 'string',
            name: 'string',
            phone: 'number',
            email: 'string',
            amount: 32906445,
            payment_method: null,
            status: 'pending',
            created_at: '2024-09-20T09:51:29.370Z',
            updated_at: '2024-09-20T09:51:29.370Z',
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
  findAll(@Query() query: FilterPriceDto) {
    return this.bookingsService.findAll(query);
  }

  // ! Get All Deleted Booking
  @Get('get-all-deleted')
  @ApiOperation({ summary: 'Lấy danh sách đơn tiệc' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  findAllDeleted(@Query() query: FilterPriceDto) {
    return this.bookingsService.findAllDeleted(query);
  }

  // ! Get One Booking
  @Get('get/:booking_id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        user_id: 'number',
        branch_id: 'number',
        space_id: 'number',
        stage_id: 'number',
        decor_id: 'number',
        menu_id: 'number',
        name: 'string',
        images: [],
        accessories: {
          chair: {
            id: 'number',
            name: 'string',
            type: 'string',
            amount: 500,
            images: ['string', 'string'],
            quantity: 30,
            description: 'string',
            total_price: 15000,
            short_description: 'string',
          },
          table: [
            {
              id: 'number',
              name: 'string',
              type: 'string',
              amount: 500,
              images: ['string', 'string'],
              quantity: 2,
              description: 'string',
              total_price: 1000,
              short_description: 'string',
            },
            {
              id: 'number',
              name: 'string',
              type: 'table',
              amount: 500,
              images: ['string', 'string'],
              quantity: 1,
              description: 'string',
              total_price: 500,
              short_description: 'string',
            },
          ],
          total_price: 16500,
        },
        shift: 'Sáng',
        organization_date: '2024-09-20T08:00:00.000Z',
        amount: 'number',
        fee: 'number',
        total_amount: 'number',
        status: 'pending',
        deleted: false,
        deleted_at: null,
        deleted_by: null,
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        users: {
          id: 'number',
          username: 'string',
          email: '',
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
    },
  })
  findOne(@Param('booking_id') id: number) {
    return this.bookingsService.findOne(id);
  }

  // ! Get Booking For Next 14 Days
  @Get('get-booking-list')
  @ApiOperation({ summary: 'Lấy danh sách đơn tiệc trong 14 ngày tới' })
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
            organization_date: '24-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '24-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '25-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '25-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '26-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '26-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '27-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '27-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '28-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '28-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '29-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '29-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '30-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '30-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '31-10-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '31-10-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '01-11-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '01-11-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '02-11-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '02-11-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '03-11-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '03-11-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '04-11-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '04-11-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '05-11-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '05-11-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '06-11-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '06-11-2024',
            shift: 'Tối',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '07-11-2024',
            shift: 'Sáng',
            status: false,
          },
          {
            id: null,
            name: null,
            organization_date: '07-11-2024',
            shift: 'Tối',
            status: false,
          },
        ],
        message: 'Lấy dữ liệu đặt chỗ thành công!',
      },
    },
  })
  @isPublic()
  getNext7Days() {
    return this.bookingsService.getBookingForNext14Days();
  }

  // ! Update Booking
  @Patch('update/:booking_id')
  @isPublic()
  @ApiOperation({ summary: 'Cập nhật thông tin một đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật đơn tiệc thành công',
      data: {
        id: 1,
        user_id: 1,
        branch_id: 1,
        space_id: 1,
        stage_id: 1,
        decor_id: 1,
        menu_id: 1,
        name: 'string',
        accessories: {
          chair: {
            id: 1,
            name: 'string',
            type: 'string',
            amount: 1,
            images: ['string', 'string'],
            quantity: 1,
            description: 'string',
            total_price: 1,
            short_description: 'string',
          },
          table: [
            {
              id: 1,
              name: 'string',
              type: 'string',
              amount: 1,
              images: ['string', 'string'],
              quantity: 1,
              description: 'string',
              total_price: 1,
              short_description: 'string',
            },
          ],
          extra_service: {
            id: 1,
            name: 'string',
            type: 'string',
            amount: 1,
            images: ['string', 'string'],
            description: 'string',
            total_price: 1,
            short_description: 'string',
          },
          total_price: 1,
        },
        images: ['string', 'string'],
        shift: 'Sáng',
        organization_date: '2024-09-20T08:00:00.000Z',
        amount: 1,
        fee: 1,
        total_amount: 1,
        status: 'pending',
        deleted: false,
        deleted_at: null,
        deleted_by: null,
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        users: {
          id: 1,
          username: 'string',
          email: '',
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
  update(
    @Request() req,
    @Param('update/booking_id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(req.user, id, updateBookingDto);
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
        space_id: 1,
        stage_id: 1,
        decor_id: 1,
        menu_id: 1,
        name: 'string',
        images: ['string', 'string'],
        shift: 'Sáng',
        organization_date: '2024-09-20T08:00:00.000Z',
        amount: 1,
        fee: 1,
        total_amount: 1,
        status: 'pending',
        deleted: false,
        deleted_at: null,
        deleted_by: null,
        created_at: '2024-09-20T09:51:29.458Z',
        updated_at: '2024-09-20T09:51:29.458Z',
        users: {
          id: 1,
          username: 'string',
          email: '',
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
    },
  })
  delete(@Request() req, @Param('booking_id') id: number) {
    return this.bookingsService.delete(req.user, id);
  }

  // ! Restore Booking
  @Patch('restore/:booking_id')
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
    },
  })
  restore(@Param('booking_id') id: number) {
    return this.bookingsService.restore(id);
  }

  // ! Hard Delete Booking
  @Delete('hard-delete/:booking_id')
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
}
