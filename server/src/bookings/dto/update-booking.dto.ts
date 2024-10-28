import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { BookingStatus } from 'helper/enum/booking_status.enum';

export class UpdateBookingDto {
  @ApiProperty({
    required: false,
    description: 'ID của người dùng (nếu có)',
    example: 1,
  })
  user_id?: number;

  @ApiProperty({
    required: true,
    description: 'ID của đặt chỗ cần cập nhật',
    example: 1,
  })
  @IsNotEmpty({ message: 'ID đặt chỗ không được để trống' })
  booking_id: number;

  @ApiProperty({
    required: true,
    description: 'ID của chi nhánh nơi tổ chức sự kiện',
    example: 2,
  })
  @IsNotEmpty({ message: 'ID chi nhánh không được để trống' })
  branch_id: number;

  @ApiProperty({
    required: true,
    description: 'ID của loại sự kiện',
    example: 3,
  })
  @IsNotEmpty({ message: 'ID loại sự kiện không được để trống' })
  party_type_id: number;

  @ApiProperty({
    required: true,
    description: 'ID của sảnh tổ chức sự kiện',
    example: 4,
  })
  @IsNotEmpty({ message: 'ID sảnh không được để trống' })
  stage_id: number;

  @ApiProperty({
    required: true,
    description: 'ID của trang trí sự kiện',
    example: 5,
  })
  @IsNotEmpty({ message: 'ID trang trí không được để trống' })
  decor_id: number;

  @ApiProperty({
    required: true,
    description: 'ID của menu sự kiện',
    example: 6,
  })
  @IsNotEmpty({ message: 'ID menu không được để trống' })
  menu_id: number;

  @ApiProperty({
    required: true,
    description: 'Họ và tên của người đặt',
    example: 'Nguyễn Văn B',
  })
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  name: string;

  @ApiProperty({
    required: true,
    description: 'Số điện thoại liên hệ',
    example: '0123456789',
  })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  phone: string;

  @ApiProperty({
    required: true,
    description: 'Địa chỉ email liên hệ',
    example: 'example@example.com',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    required: true,
    description: 'Tên công ty (nếu có)',
    example: 'Công ty TNHH XYZ',
  })
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  company_name: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng khách dự kiến',
    example: 50,
  })
  @IsOptional()
  number_of_guests?: number;

  @ApiProperty({
    required: false,
    description: 'Ngân sách dự kiến cho sự kiện',
    example: '50 triệu đến 100 triệu',
  })
  @IsOptional()
  budget?: string;

  @ApiProperty({
    required: true,
    description: 'Ghi chú thêm về sự kiện',
    example: 'Yêu cầu đặc biệt về thực đơn',
  })
  @IsNotEmpty({ message: 'Ghi chú không được để trống' })
  note: string;

  @ApiProperty({
    required: true,
    description: 'Số lượng bàn cần đặt',
    example: 5,
  })
  @IsNotEmpty({ message: 'Số lượng bàn không được để trống' })
  table_count: number;
  @ApiProperty({
    description:
      'Tổng tiền của sự kiện: Tiền trang trí + tiền ghế 100k/1 ghế 50k/1 (1 bàn = 10 ghế) => (100k + (50k * 10)) + tiền menu (menu * tổng bàn) + phí',
    example: 1000000,
  })
  @IsNotEmpty({ message: 'Tổng tiền không được để trống' })
  amount: number;

  @ApiProperty({
    example: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    description:
      'Danh sách các dịch vụ khác (chỉ điền id và số lượng khi đã đặt cọc thành công)',
  })
  extra_service: [{ id: number; quantity: number }] | any;

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
    enum: ['pending', 'processing', 'success', 'cancel'],
    example: 'pending',
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
