import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ShiftEnum } from 'helper/enum/shift.enum';

export class CreateBookingDto {
  @ApiProperty({
    required: false,
    description: 'ID của người dùng (nếu có)',
  })
  user_id?: number;

  @ApiProperty({
    required: true,
    description: 'ID của chi nhánh nơi tổ chức tiệc',
  })
  @IsNotEmpty({ message: 'Chi nhánh không được để trống' })
  branch_id: string;

  @ApiProperty({
    required: true,
    description: 'ID của loại tiệc',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn loại tiệc' })
  party_type_id: string;

  @ApiProperty({
    required: false,
    description: 'ID của sảnh (nếu có)',
  })
  stage_id?: string;

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
  @IsOptional()
  company_name?: string;

  @ApiProperty({
    required: false,
    description: 'Ghi chú thêm về tiệc',
  })
  note?: string;

  @ApiProperty({
    required: false,
    description: 'Số lượng khách dự kiến',
  })
  number_of_guests?: number;

  @ApiProperty({
    required: false,
    description: 'Ngân sách dự kiến cho tiệc',
  })
  budget?: string;

  @ApiProperty({
    required: true,
    description: 'Ca tổ chức tiệc',
    enum: ShiftEnum,
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ca' })
  @IsEnum(ShiftEnum, {
    message: 'Ca tổ chức không hợp lệ (Sáng, Tối)',
  })
  shift: string;

  @ApiProperty({
    required: true,
    description: 'Ngày tổ chức tiệc (định dạng: DD-MM-YYYY)',
  })
  @IsNotEmpty({ message: 'Vui lòng chọn ngày tổ chức tiệc' })
  organization_date: string;
}
