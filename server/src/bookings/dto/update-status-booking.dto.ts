import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class UpdateStatusBookingDto {
  @ApiProperty({ required: true })
  is_confirm: boolean;

  @ApiProperty({ required: true })
  is_deposit: boolean;

  @ApiProperty({ required: true })
  @IsEnum(BookingStatus, {
    message: 'Trạng thái không hợp lệ (pending, processing, success, cancel)',
  })
  status: string;
}
