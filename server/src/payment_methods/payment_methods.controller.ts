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
@Controller('api/payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  // ! Payment Momo
  @Get('momo/:deposit_id')
  @isPublic()
  @ApiOperation({ summary: 'Thanh toán qua Momo' })
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

  /* // ! OnePay
  @Get('onepay/:deposit_id')
  @isPublic()
  @ApiOperation({ summary: 'Thanh toán qua OnePay' })
  onePay(
    @Param('deposit_id') id: number,
    @Request() req: any,
    @Response() res: any,
  ) {
    return this.paymentMethodsService.onePay(id, req, res);
  }

  // ! OnePay Callback
  @Get('onepay-callback')
  @isPublic()
  callbackOnepay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.callbackOnePay(query, res);
  }
 */
  // ! Payment ZaloPay
  @Post('zalopay/:deposit_id')
  @isPublic()
  @ApiOperation({ summary: 'Thanh toán qua ZaloPay' })
  zaloPay(
    @Param('deposit_id') id: number,
    @Request() req: any,
    @Response() res: any,
  ) {
    return this.paymentMethodsService.zaloPay(id, req, res);
  }

  // ! ZaloPay Callback
  @Post('zalopay-callback')
  @isPublic()
  callbackZaloPay(@Query() query: any, @Request() req, @Response() res: any) {
    return this.paymentMethodsService.callbackZaloPay(query, req, res);
  }
}
