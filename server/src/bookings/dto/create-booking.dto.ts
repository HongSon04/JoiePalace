import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ShiftEnum } from 'helper/enum/shift.enum';

export class CreateBookingDto {
  @ApiProperty({
    required: false,
    description: 'ID của người dùng (nếu có)',
    example: 1,
  })
  user_id?: number;

  @ApiProperty({
    required: true,
    description: 'ID của chi nhánh nơi tổ chức sự kiện',
    example: 2,
  })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  branch_id: number;

  @ApiProperty({
    required: true,
    description: 'ID của loại sự kiện',
    example: 3,
  })
  @IsNotEmpty({ message: 'Vui lòng chọn loại sự kiện' })
  party_type_id: number;

  @ApiProperty({
    required: false,
    description: 'ID của sảnh (nếu có)',
    example: 4,
  })
  stage_id?: number;

  @ApiProperty({
    required: true,
    description: 'Họ và tên của người đặt',
    example: 'Nguyễn Văn A',
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
    required: false,
    description: 'Tên công ty (nếu có)',
    example: 'Công ty TNHH ABC',
  })
  @IsOptional()
  company_name?: string;

  @ApiProperty({
    required: true,
    description: 'Ghi chú thêm về sự kiện',
    example: 'Yêu cầu đặc biệt về thực đơn',
  })
  note: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng khách dự kiến',
    example: 50,
  })
  number_of_guests?: number;

  @ApiProperty({
    required: false,
    description: 'Ngân sách dự kiến cho sự kiện',
    example: '50 củ tới 100 củ',
  })
  budget?: string;

  @ApiProperty({
    required: true,
    description: 'Ca tổ chức sự kiện',
    enum: ShiftEnum,
    example: ShiftEnum.SÁNG,
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ca' })
  @IsEnum(ShiftEnum, {
    message: 'Ca tổ chức không hợp lệ (Sáng, Tối)',
  })
  shift: string;

  @ApiProperty({
    required: true,
    description: 'Ngày tổ chức sự kiện (định dạng: DD-MM-YYYY)',
    example: '30-12-2024',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ngày tổ chức sự kiện' })
  organization_date: string;
}
