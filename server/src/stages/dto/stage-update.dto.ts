import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StageUpdateDto {
  @ApiProperty({ required: true })
  @IsOptional()
  branch_id: number;

  @ApiProperty({ required: true })
  @IsOptional()
  name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  description: string;

  @ApiProperty({ required: true })
  @IsOptional()
  capacity: number;

  @ApiProperty({ required: true })
  @IsOptional()
  images: string[];
}
