import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DepositStatusEnum } from 'helper/enum/deposit.enum';
import { PaymentMethod } from 'helper/enum/payment_method.enum';

export class UpdateDepositDto {
  @ApiProperty({
    description: 'Trạng thái của giao dịch, không được để trống',
    example: DepositStatusEnum.PENDING,
    required: true,
    enum: DepositStatusEnum,
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(DepositStatusEnum, {
    message:
      'Trạng thái không hợp lệ. Các giá trị hợp lệ: cancel, pending, success',
  })
  status: DepositStatusEnum | string;

  @ApiProperty({
    description:
      'Phương thức thanh toán được sử dụng cho giao dịch, không được để trống',
    required: true,
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod, {
    message:
      'Phương thức thanh toán không hợp lệ. Các giá trị hợp lệ: cash, bank, momo, vnpay, zalo, onepay',
  })
  payment_method: PaymentMethod;
}
