import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên menu không được để trống' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ example: [1, 2, 3] })
  products: number[];

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({ example: ['true', 'false'] })
  is_show: boolean;
}
