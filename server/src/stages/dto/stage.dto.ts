import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StageDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty({ message: 'Location ID không được để trống' })
  location_id: number;
  @ApiProperty({ type: String, example: 'Sảnh A1' })
  @IsNotEmpty({ message: 'Tên sảnh không được để trống' })
  name: string;

  @ApiProperty({ type: String, example: 'Mô Tả Sảnh A1' })
  @IsNotEmpty({ message: 'Mô tả sảnh không được để trống' })
  description: string;

  @ApiProperty({ type: [String] })
  images: string[] | any;
}
