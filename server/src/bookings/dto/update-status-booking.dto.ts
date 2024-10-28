import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class UpdateStatusBookingDto {
  @ApiProperty({
    required: true,
    description: 'Trạng thái xác nhận của đặt chỗ',
    example: true || false,
    enum: [true, false],
  })
  @IsNotEmpty({ message: 'Trạng thái xác nhận không được để trống' })
  is_confirm: boolean;

  @ApiProperty({
    required: true,
    description: 'Trạng thái đặt cọc của đặt chỗ',
    example: true || false,
    enum: [true, false],
  })
  @IsNotEmpty({ message: 'Trạng thái đặt cọc không được để trống' })
  is_deposit: boolean;

  @ApiProperty({
    required: true,
    description: 'Trạng thái của đặt chỗ',
    enum: BookingStatus,
    example: BookingStatus.PROCESSING,
  })
  @IsEnum(BookingStatus, {
    message: 'Trạng thái không hợp lệ (pending, processing, success, cancel)',
  })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  status: string;
}
