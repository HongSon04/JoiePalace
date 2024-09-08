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
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên menu không được để trống' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({ example: [1, 2, 3] })
  @ArrayNotEmpty({ message: 'Danh sách món ăn không được để trống' }) // Mảng không được trống
  @ArrayMinSize(1, { message: 'Cần ít nhất 1 món ăn' }) // Số lượng tối thiểu 1 phần tử
  @ArrayMaxSize(10, { message: 'Chỉ cho phép tối đa 10 món ăn' }) // Tùy chọn: giới hạn số lượng
  @Type(() => Number) // Chuyển đổi các phần tử trong mảng thành số
  @IsInt({
    each: true,
    message: 'Mỗi phần tử trong danh sách món ăn phải là số nguyên',
  }) // Kiểm tra mỗi phần tử trong mảng có phải là số nguyên không
  foods: number[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({ example: ['true', 'false'] })
  is_show: boolean;
}
