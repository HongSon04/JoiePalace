import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateStatusBookingDto {
  @ApiProperty({ required: true })
  is_confirm: boolean;

  @ApiProperty({ required: true })
  is_deposit: boolean;

  @ApiProperty({ required: true })
  @IsEnum(['pending', 'processing', 'success', 'cancel'], {
    message: 'Trạng thái không hợp lệ (pending, processing, success, cancel)',
  })
  status: string;
}
