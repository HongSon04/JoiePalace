import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Tên menu, không được để trống',
    example: 'Menu Bữa Trưa',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên menu không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về menu, không được để trống',
    example: 'Menu này bao gồm các món ăn đặc sắc cho bữa trưa.',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Danh sách các ID sản phẩm có trong menu',
    example: [1, 2, 3],
    required: false,
  })
  products: number[];

  @ApiProperty({
    description: 'Giá của menu, không được để trống',
    example: 150000,
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;

  @ApiProperty({
    description: 'Menu có hiển thị cho khách hàng hay không',
    example: true,
    required: false,
  })
  @IsBoolean({ message: 'Hiện thị phải là một giá trị boolean' })
  @IsEnum([true, false], { message: 'Hiện thị phải là một giá trị boolean' })
  is_show: boolean;
}
