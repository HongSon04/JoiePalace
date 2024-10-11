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
import { VNPaySuccessDto } from './dto/vnpay-success.dto';
import { MomoSuccessDto } from './dto/momo-success.dto';

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
  successMomo(@Query() query: MomoSuccessDto, @Response() res: any) {
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
  successVNPay(@Query() query: VNPaySuccessDto, @Response() res: any) {
    return this.paymentMethodsService.successVNPay(query, res);
  }

  // ! Payment VNPay Fail
  @Get('vnpay-fail')
  @isPublic()
  failVNPay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.failVNPay(query, res);
  }

  // ! OnePay
  @Get('onepay/:deposit_id')
  @isPublic()
  @ApiOperation({ summary: 'Thanh toán qua OnePay' })
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
  onepay(
    @Param('deposit_id') id: number,
    @Request() req: any,
    @Response() res: any,
  ) {
    return this.paymentMethodsService.onepay(id, req, res);
  }

  // ! OnePay Success
  @Get('onepay-success')
  @isPublic()
  successOnePay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.successOnePay(query, res);
  }

  // ! OnePay Fail
  @Get('onepay-fail')
  @isPublic()
  failOnePay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.failOnePay(query, res);
  }
}
