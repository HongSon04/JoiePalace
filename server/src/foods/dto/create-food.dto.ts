import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Danh mục không được để trống' })
  category_id: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên món ăn không được để trống' })
  name: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả ngắn không được để trống' })
  short_description: string;
  @ApiProperty({ example: [1, 2, 3] })
  @IsNotEmpty({ message: 'Tags không được để trống' })
  tags: number[];
  @ApiProperty()
  @IsNotEmpty({ message: 'Giá không được để trống' })
  price: number;
  @ApiProperty()
  images: string[];
}
