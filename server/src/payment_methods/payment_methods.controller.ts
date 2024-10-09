import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { PaymentMethodsService } from './payment_methods.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';

@ApiTags('payment-methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  // ! Payment Momo
  @Post('momo/:deposit_id')
  @isPublic()
  @ApiOperation({ summary: 'Thanh toán qua Momo' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Thanh toán thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Thanh toán thất bại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  momo(
    @Param('deposit_id') id: number,
    @Request() req: any,
    @Response() res: any,
  ) {
    return this.paymentMethodsService.momo(id, req, res);
  }

  // ! Payment Momo Success
  @Get('momo-success')
  @isPublic()
  successMomo(@Query() query: any, @Response() res: any) {
    console.log(query);
    return this.paymentMethodsService.successMomo(query, res);
  }

  // ! Payment Momo Fail
  @Get('momo-fail')
  @isPublic()
  failMomo(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.failMomo(query, res);
  }

  // ! Payment VNPay
  @Get('vnpay/:deposit_id')
  @isPublic()
  @ApiOperation({ summary: 'Thanh toán qua VNPay' })
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Thanh toán thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Thanh toán thất bại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  vnpay(
    @Param('deposit_id') id: number,
    @Request() req: any,
    @Response() res: any,
  ) {
    return this.paymentMethodsService.vnpay(id, req, res);
  }

  // ! Payment VNPay Success
  @Get('vnpay-success')
  @isPublic()
  successVNPay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.successVNPay(query, res);
  }

  // ! Payment VNPay Fail
  @Get('vnpay-fail')
  @isPublic()
  failVNPay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.failVNPay(query, res);
  }
}
