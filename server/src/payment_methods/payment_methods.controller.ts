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
import { MomoCallbackDto } from './dto/momo-callback.dto';

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

  // ! Momo Callback

  @Get('momo-callback')
  @isPublic()
  callbackMomo(@Query() Query: MomoCallbackDto | any, @Response() res: any) {
    return this.paymentMethodsService.callbackMomo(Query, res);
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

  // ! VNPay Callback
  @Get('vnpay-callback')
  @isPublic()
  callbackVnpay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.callbackVNPay(query, res);
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

  // ! OnePay Callback
  @Get('onepay-callback')
  @isPublic()
  callbackOnepay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.callbackOnepay(query, res);
  }
}
