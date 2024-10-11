import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StageDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty({ message: 'Branch ID không được để trống' })
  branch_id: number;
  @ApiProperty({ type: String, example: 'Sảnh A1' })
  @IsNotEmpty({ message: 'Tên sảnh không được để trống' })
  name: string;

  @ApiProperty({ type: String, example: 'Mô Tả Sảnh A1' })
  @IsNotEmpty({ message: 'Mô tả sảnh không được để trống' })
  description: string;

  @ApiProperty({ type: Number, example: 'Số lượng bàn VD: 50' })
  @IsNotEmpty({ message: 'Số lượng bàn không được để trống' })
  capacity: number;

  @ApiProperty({ type: [String] })
  images: string[] | any;

  
}
