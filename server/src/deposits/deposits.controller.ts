import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { DepositsService } from './deposits.service';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateDepositDto } from './dto/update-status.dto';
import { isPublic } from 'decorator/auth.decorator';

@ApiTags('Deposits - Quản lý đặt cọc')
@Controller('api/deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  // ? Find By ID
  @Get('get/:deposit_id')
  @isPublic()
  @ApiOperation({ summary: 'Lấy chi tiết thông tin đặt cọc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy chi tiết thông tin đặt cọc thành công',
    example: {
      id: 1,
      transactionID: '123456',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nguyenvana@gmail.com',
      payment_method: 'MOMO',
      amount: 1000000,
      status: 'PENDING',
      expired_at: '2021-09-01T00:00:00.000Z',
      createdAt: '2021-09-01T00:00:00.000Z',
      updatedAt: '2021-09-01T00:00:00.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy thông tin đặt cọc',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Đã có lỗi xảy ra',
  })
  findOneById(@Param('deposit_id') id: string) {
    return this.depositsService.findOne(+id);
  }

  // ? Find By Transaction ID
  @Get('transaction/:transactionID')
  @isPublic()
  @ApiOperation({ summary: 'Lấy chi tiết thông tin đặt cọc theo mã giao dịch' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy chi tiết thông tin đặt cọc thành công',
    example: {
      id: 1,
      transactionID: '123456',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nguyenvana@gmail.com',
      payment_method: 'MOMO',
      amount: 1000000,
      status: 'PENDING',
      expired_at: '2021-09-01T00:00:00.000Z',
      createdAt: '2021-09-01T00:00:00.000Z',
      updatedAt: '2021-09-01T00:00:00.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy thông tin đặt cọc',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Đã có lỗi xảy ra',
  })
  findOneByTransactionId(@Param('transactionID') transactionID: string) {
    return this.depositsService.findOneByTransactionId(transactionID);
  }

  // ? Update
  @Patch('update/:deposit_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Cập nhật trạng thái đặt cọc' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật trạng thái đặt cọc thành công',
    example: {
      id: 1,
      transactionID: '123456',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nguyenvana@gmail.com',
      payment_method: 'MOMO',
      amount: 1000000,
      status: 'PENDING',
      expired_at: '2021-09-01T00:00:00.000Z',
      createdAt: '2021-09-01T00:00:00.000Z',
      updatedAt: '2021-09-01T00:00:00.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy thông tin đặt cọc',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Đã có lỗi xảy ra',
  })
  update(
    @Param('deposit_id') id: string,
    @Body() updateDepositDto: UpdateDepositDto,
  ) {
    return this.depositsService.update(+id, updateDepositDto);
  }

  // ? Update  by Transaction ID
  @Patch('update/transaction/:transactionID')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiOperation({ summary: 'Cập nhật trạng thái đặt cọc theo mã giao dịch' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cập nhật trạng thái đặt cọc thành công',
    example: {
      id: 1,
      transactionID: '123456',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nguyenvana@gmail.com',
      payment_method: 'MOMO',
      amount: 1000000,
      status: 'PENDING',
      expired_at: '2021-09-01T00:00:00.000Z',
      createdAt: '2021-09-01T00:00:00.000Z',
      updatedAt: '2021-09-01T00:00:00.000Z',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy thông tin đặt cọc',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Đã có lỗi xảy ra',
  })
  updateByTransactionID(
    @Param('transactionID') transactionID: string,
    @Body() updateDepositDto: UpdateDepositDto,
  ) {
    return this.depositsService.updateByTransactionID(
      transactionID,
      updateDepositDto,
    );
  }
}
