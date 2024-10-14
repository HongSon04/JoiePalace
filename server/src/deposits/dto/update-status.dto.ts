import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDepositDto {
  @ApiProperty({ required: true, example: 'cancelled|pending|completed' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['cancelled', 'pending', 'completed'], {
    message: 'Trạng thái không hợp lệ',
  })
  status: string;

  @ApiProperty({ example: 'momo|vnpay|onepay|zalopay|banking' })
  @IsString()
  @IsEnum(['momo', 'vnpay', 'onepay', 'zalopay', 'banking'], {
    message: 'Phương thức thanh toán không hợp lệ',
  })
  payment_method: string;
}
