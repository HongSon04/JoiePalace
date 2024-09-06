import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSpaceDto {
  @ApiProperty()
  @IsNumber({}, { message: 'Location ID không hợp lệ' })
  @IsNotEmpty({ message: 'Location ID không được để trống' })
  location_id: number;
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;
  @ApiProperty()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;
  @ApiProperty()
  images: string[];

  slug: any;
}
