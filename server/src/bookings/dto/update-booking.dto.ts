import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class UpdateBookingDto {
  @ApiProperty({ required: false })
  user_id: number;

  @ApiProperty({ required: true })
  booking_id: number;

  @ApiProperty({ required: true })
  branch_id: number;

  @ApiProperty({ required: true })
  party_type_id: number;

  @ApiProperty({ required: true })
  stage_id: number;

  @ApiProperty({ required: true })
  decor_id: number;

  @ApiProperty({ required: true })
  menu_id: number;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  company_name: string;

  @ApiProperty({ required: false })
  number_of_guests: number;

  @ApiProperty({ required: false })
  budget: string;

  @ApiProperty({ required: true })
  note: string;

  @ApiProperty({ required: true })
  table_count: number;

  @ApiProperty({
    description:
      'Tổng tiền của sự kiện: Tiền trang trí + tiền ghế 100k/1 tiền ghế 50k/1 (1 bàn = 10 ghế) => (100k + (50k * 10)) + tiền menu(menu * tổng bàn) + phí',
  })
  amount: number;

  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description:
      'Danh sách các dịch vụ khác (chỉ điền id và số lượng khi đã đặt cọc thành công)',
  })
  extra_sevice: [{ id: number; quantity: number }] | any;
  @ApiProperty({ required: true })
  is_confirm: boolean;

  @ApiProperty({ required: true })
  is_deposit: boolean;

  @ApiProperty({ required: true })
  @IsEnum(BookingStatus, {
    message: 'Trạng thái không hợp lệ (pending, processing, success, cancel)',
  })
  status: string;

  @ApiProperty({ type: [String] })
  images: string[] | any;
}
