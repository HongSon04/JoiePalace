import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StageUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  branch_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ type: Number, example: 'Số lượng bàn tối thiểu' })
  capacity_min: number;

  @ApiProperty({ type: Number, example: 'Số lượng bàn tối đa' })
  capacity_max: number;

  @ApiProperty({ required: false })
  @IsOptional()
  images: string[];
}
