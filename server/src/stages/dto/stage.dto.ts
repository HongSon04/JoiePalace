import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StageDto {
  @ApiProperty({ type: Number, example: 1, description: 'ID của chi nhánh' })
  @IsNotEmpty({ message: 'Branch ID không được để trống' })
  branch_id: number;

  @ApiProperty({
    type: String,
    example: 'Sảnh A1',
    description: 'Tên của sảnh',
  })
  @IsNotEmpty({ message: 'Tên sảnh không được để trống' })
  name: string;

  @ApiProperty({
    type: String,
    example: 'Mô Tả Sảnh A1',
    description: 'Mô tả chi tiết về sảnh',
  })
  @IsNotEmpty({ message: 'Mô tả sảnh không được để trống' })
  description: string;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Số lượng bàn tối thiểu',
  })
  @IsNotEmpty({ message: 'Số lượng bàn tối thiểu không được để trống' })
  capacity_min: number;

  @ApiProperty({
    type: Number,
    example: 50,
    description: 'Số lượng bàn tối đa',
  })
  @IsNotEmpty({ message: 'Số lượng bàn tối đa không được để trống' })
  capacity_max: number;

  @ApiProperty({
    type: [String],
    description: 'Danh sách các hình ảnh của sảnh',
  })
  images: string[];
}
