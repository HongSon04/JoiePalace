import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';
import { MomoCallbackDto } from './dto/momo-callback.dto';
import { PaymentMethodsService } from './payment_methods.service';

@ApiTags('Payment Methods - Phương thức thanh toán')
@Controller('api/payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  // ! Payment Momo
  @Post('momo/:deposit_id')
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
  @ApiExcludeEndpoint()
  callbackMomo(@Query() Query: MomoCallbackDto | any, @Response() res: any) {
    return this.paymentMethodsService.callbackMomo(Query, res);
  }

  // ! Payment VNPay
  @Post('vnpay/:deposit_id')
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
  @ApiExcludeEndpoint()
  callbackVnpay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.callbackVNPay(query, res);
  }

  // ! OnePay
  @Post('onepay/:deposit_id')
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
  @ApiExcludeEndpoint()
  callbackOnepay(@Query() query: any, @Response() res: any) {
    return this.paymentMethodsService.callbackOnePay(query, res);
  }

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
  @ApiExcludeEndpoint()
  callbackZaloPay(@Query() query: any, @Request() req, @Response() res: any) {
    return this.paymentMethodsService.callbackZaloPay(query, req, res);
  }
}
