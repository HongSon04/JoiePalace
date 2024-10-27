import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from 'helper/enum/payment_method.enum';

export class UpdateDepositDto {
  @ApiProperty({ required: true, example: 'cancelled|pending|completed' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['cancelled', 'pending', 'completed'], {
    message: 'Trạng thái không hợp lệ',
  })
  status: string;

  @ApiProperty({ required: true })
  @IsEnum(PaymentMethod, {
    message:
      'Phương thức thanh toán không hợp lệ (cash, bank, momo, vnpay, zalo, onepay)',
  })
  payment_method: string;
}
