import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterDto } from 'helper/dto/Filter.dto';
import { FilterFeedBackDto } from './dto/FilterFeedBackDto';

@ApiTags('Feedbacks - Quản lý đánh giá')
@Controller('/api/feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  // ! Tạo Feedback
  @Post('create')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Tạo feedback' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo feedback thành công !',
      data: {
        id: 'number',
        booking_id: 'number',
        user_id: 'number',
        branch_id: 'number',
        content: 'string',
        rating: 'number',
        status: 'boolean',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy đơn tiệc',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(createFeedbackDto);
  }

  // ! Lấy tất cả feedback đã được duyệt
  @Get('get-all-show')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Lấy tất cả feedback đã được duyệt' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: [
      {
        id: 'number',
        booking_id: 'number',
        user_id: 'number',
        branch_id: 'number',
        content: 'string',
        rating: 'number',
        status: 'boolean',
        created_at: 'date',
        updated_at: 'date',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  findAll(@Query() query: FilterDto) {
    return this.feedbacksService.findAllShow(query);
  }

  // ! Lấy tất cả feedback bị ẩn
  @Get('get-all-hide')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Lấy tất cả feedback bị ẩn' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: [
      {
        id: 'number',
        booking_id: 'number',
        user_id: 'number',
        branch_id: 'number',
        content: 'string',
        rating: 'number',
        status: 'boolean',
        created_at: 'date',
        updated_at: 'date',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  findAllHide(@Query() query: FilterFeedBackDto) {
    return this.feedbacksService.findAllHide(query);
  }

  // ! Lấy tất cả feedback theo id
  @Get('get/:feedback_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Lấy feedback theo id' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 'number',
      booking_id: 'number',
      user_id: 'number',
      branch_id: 'number',
      content: 'string',
      rating: 'number',
      status: 'boolean',
      created_at: 'date',
      updated_at: 'date',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy feedback',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  findOne(@Param('feedback_id') id: string) {
    return this.feedbacksService.findOne(+id);
  }

  // ! Lấy tất cả feedback theo id của booking
  @Get('get-by-booking/:booking_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Lấy feedback theo ID của đơn tiệc' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 'number',
      booking_id: 'number',
      user_id: 'number',
      branch_id: 'number',
      content: 'string',
      rating: 'number',
      status: 'boolean',
      created_at: 'date',
      updated_at: 'date',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy feedback',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  findByBooking(@Param('booking_id') id: string) {
    return this.feedbacksService.findByBooking(+id);
  }

  // ! Lấy tất cả feedback theo id của branch
  @Get('get-by-branch/:branch_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'is_show', required: false })
  @ApiQuery({ name: 'is_approved', required: false })
  @ApiOperation({ summary: 'Lấy feedback theo ID của chi nhánh' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 'number',
      booking_id: 'number',
      user_id: 'number',
      branch_id: 'number',
      content: 'string',
      rating: 'number',
      status: 'boolean',
      created_at: 'date',
      updated_at: 'date',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy feedback',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  findByBranch(
    @Param('branch_id') id: string,
    @Query() query: FilterFeedBackDto,
  ) {
    return this.feedbacksService.findByBranch(+id, query);
  }

  // ! Lấy tất cả feedback theo id của user
  @Get('get-by-user/:user_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Lấy feedback theo ID của người dùng' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      id: 'number',
      booking_id: 'number',
      user_id: 'number',
      branch_id: 'number',
      content: 'string',
      rating: 'number',
      status: 'boolean',
      created_at: 'date',
      updated_at: 'date',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy feedback',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  findByUser(@Param('user_id') id: string) {
    return this.feedbacksService.findByUser(+id);
  }

  // ! Cập nhật feedback
  @Patch('update/:feedback_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Cập nhật feedback' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật feedback thành công !',
      data: {
        id: 'number',
        booking_id: 'number',
        user_id: 'number',
        branch_id: 'number',
        content: 'string',
        rating: 'number',
        status: 'boolean',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy feedback',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server',
    },
  })
  update(
    @Param('feedback_id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbacksService.update(+id, updateFeedbackDto);
  }

  @Delete('destroy/:feedback_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Xóa feedback' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa feedback thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy feedback',
    },
  })
  remove(@Param('feedback_id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
