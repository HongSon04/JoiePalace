import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class UpdateStatusBookingDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái xác nhận của đặt chỗ',
    enum: [true, false],
  })
  is_confirm: boolean;

  @ApiProperty({
    required: true,
    description: 'Trạng thái đặt cọc của đặt chỗ',
    enum: [true, false],
  })
  is_deposit: boolean;

  @ApiProperty({
    required: true,
    description: 'Trạng thái của đặt chỗ',
    enum: BookingStatus,
  })
  @IsEnum(BookingStatus, {
    message: 'Trạng thái không hợp lệ (pending, processing, success, cancel)',
  })
  status: string;
}
