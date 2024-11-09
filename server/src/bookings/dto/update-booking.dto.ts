import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class UpdateBookingDto {
  @ApiProperty({
    required: false,
    description: 'ID của người dùng (nếu có)',
  })
  user_id?: string;

  @ApiProperty({
    required: false,
    description: 'ID của đặt chỗ cần cập nhật',
  })
  booking_id?: string;

  @ApiProperty({
    required: true,
    description: 'ID của chi nhánh nơi tổ chức sự kiện',
  })
  @IsNotEmpty({ message: 'ID chi nhánh không được để trống' })
  branch_id: string;

  @ApiProperty({
    required: true,
    description: 'ID của loại sự kiện',
  })
  @IsNotEmpty({ message: 'ID loại sự kiện không được để trống' })
  party_type_id: string;

  @ApiProperty({
    required: true,
    description: 'ID của sảnh tổ chức sự kiện',
  })
  @IsNotEmpty({ message: 'ID sảnh không được để trống' })
  stage_id: string;

  @ApiProperty({
    required: true,
    description: 'ID của trang trí sự kiện',
  })
  @IsNotEmpty({ message: 'ID trang trí không được để trống' })
  decor_id: string;

  @ApiProperty({
    required: true,
    description: 'ID của menu sự kiện',
  })
  @IsNotEmpty({ message: 'ID menu không được để trống' })
  menu_id: string;

  @ApiProperty({
    required: true,
    description: 'Họ và tên của người đặt',
  })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại liên hệ',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ email liên hệ',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    required: false,
    description: 'Tên công ty (nếu có)',
  })
  company_name?: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng khách dự kiến',
  })
  @IsOptional()
  number_of_guests?: string;

  @ApiProperty({
    required: false,
    description: 'Ngân sách dự kiến cho sự kiện',
  })
  @IsOptional()
  budget?: string;

  gift?: string[];

  @ApiProperty({
    required: false,
    description: 'Ghi chú thêm về sự kiện',
  })
  note?: string;

  @ApiProperty({
    required: true,
    description: 'Số lượng bàn cần đặt',
  })
  @IsNotEmpty({ message: 'Số lượng bàn không được để trống' })
  table_count: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng bàn dự phòng',
  })
  @IsNotEmpty({ message: 'Số lượng bàn dự phòng không được để trống' })
  spare_table_count: string;

  @ApiProperty({
    description:
      'Tổng tiền của sự kiện: Tiền trang trí + tiền ghế 200k/1 ghế 50k/1 (1 bàn = 10 ghế) => (200k + (50k * 10)) + tiền menu (menu * tổng bàn) + tiền sảnh + phí',
  })
  @IsNotEmpty({ message: 'Tổng tiền không được để trống' })
  amount: string;

  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description: 'Danh sách các dịch vụ khác (ví dụ nước uống, bánh kem, ...)',
  })
  other_service?: [{ id: string; quantity: number }] | any;

  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description:
      'Danh sách các dịch vụ thêm (chỉ điền id và số lượng khi đã đặt cọc thành công)',
  })
  extra_service?: [{ id: string; quantity: number }] | any;

  @ApiProperty({
    required: true,
    description: 'Trạng thái xác nhận của đặt chỗ',
    enum: [true, false],
  })
  @IsNotEmpty({ message: 'Trạng thái xác nhận không được để trống' })
  is_confirm: boolean;

  @ApiProperty({
    required: true,
    description: 'Trạng thái đặt cọc của đặt chỗ',
    enum: [true, false],
  })
  @IsNotEmpty({ message: 'Trạng thái đặt cọc không được để trống' })
  is_deposit: boolean;

  @ApiProperty({
    required: true,
    description: 'Trạng thái của đặt chỗ',
    enum: ['pending', 'processing', 'success', 'cancel'],
  })
  @IsEnum(BookingStatus, {
    message: 'Trạng thái không hợp lệ (pending, processing, success, cancel)',
  })
  status: string;

  @ApiProperty({
    type: [String],
    description: 'Danh sách các hình ảnh liên quan đến sự kiện',
    required: false,
  })
  @IsOptional()
  images?: string[];
}
