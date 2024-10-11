import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Branch ID không được để trống' })
  branch_id: number;
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;
  @ApiProperty({ required: true })
  images: string[];

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  slug: any;
}
