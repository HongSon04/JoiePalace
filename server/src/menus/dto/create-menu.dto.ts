import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({
    description: 'Tên menu, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Tên menu không được để trống' })
  name: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về menu, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @ApiProperty({
    description: 'Danh sách các ID sản phẩm có trong menu',
    required: false,
    example: [1, 2, 3],
  })
  @IsNotEmpty({ message: 'Danh sách sản phẩm không được để trống' })
  products: number[];

  @ApiProperty({
    description: 'Giá của menu, không được để trống',
    required: true,
  })
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: string;

  @ApiProperty({
    description: 'Menu có hiển thị cho khách hàng hay không',
    required: false,
  })
  is_show: boolean;

  @ApiProperty({
    description: 'Ảnh Menu, không được để trống',
    required: true,
  })
  images: string[];
}
