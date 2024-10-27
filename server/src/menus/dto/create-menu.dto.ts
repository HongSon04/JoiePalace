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
  @ArrayNotEmpty({ message: 'Danh sách sản phẩm không được để trống' })
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 món ăn' })
  @ArrayMaxSize(10, { message: 'Chỉ cho phép tối đa 10 món ăn' })
  @Type(() => Number)
  @IsInt({
    each: true,
    message: 'Mỗi phần tử trong Danh sách sản phẩm phải là số nguyên',
  })
  products: number[];

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({ example: ['true', 'false'] })
  is_show: boolean;
}
