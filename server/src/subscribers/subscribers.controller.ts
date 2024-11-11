import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterDto } from 'helper/dto/Filter.dto';
import { isPublic } from 'decorator/auth.decorator';

@Controller('api/subscribers')
@ApiTags('Subscribers - Quản lý người đăng ký')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  // ! Register a new subscriber
  @Post('register')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Đăng ký nhận thông báo thành công',
      data: {
        email: 'abc@gmail.com',
        is_receive: true,
        is_receive_sales: true,
        is_receive_notify: true,
        is_receive_blog: true,
        created_at: '2021-10-10T00:00:00.000Z',
        updated_at: '2021-10-10T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Địa chỉ email đã đăng ký nhận thông báo',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
    },
  })
  @ApiOperation({ summary: 'Đăng ký nhận thông báo' })
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscribersService.create(createSubscriberDto);
  }

  // ! Get all subscribers
  @Get('get-all')
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
      message: 'Lấy danh sách thành công',
      data: [
        {
          email: 'abc@gmail.com',
          is_receive: true,
          is_receive_sales: true,
          is_receive_notify: true,
          is_receive_blog: true,
          created_at: '2021-10-10T00:00:00.000Z',
          updated_at: '2021-10-10T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách người đăng ký' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  findAll(@Query() query: FilterDto) {
    return this.subscribersService.findAll(query);
  }

  // ! Update a subscriber
  @Patch('update/:email')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật thông tin thành công',
      data: {
        email: 'abc@gmail.com',
        is_receive: true,
        is_receive_sales: true,
        is_receive_notify: true,
        is_receive_blog: true,
        created_at: '2021-10-10T00:00:00.000Z',
        updated_at: '2021-10-10T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Địa chỉ email không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy email này',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
    },
  })
  @ApiOperation({ summary: 'Cập nhật thông tin người đăng ký' })
  update(
    @Param('email') email: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
  ) {
    return this.subscribersService.update(email, updateSubscriberDto);
  }
}
