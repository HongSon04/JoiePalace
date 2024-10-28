import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateMembershipDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên hạng thành viên không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả hạng thành viên không được để trống' })
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Ảnh hạng thành viên không được để trống' })
  image: string[];

  @ApiProperty({ example: [1, 2, 3] })
  gifts: number[];

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tổng tiền đã đặc tiệc không được để trống' })
  booking_total_amount: number;
}
