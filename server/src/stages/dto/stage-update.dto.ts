import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StageUpdateDto {
  @ApiProperty()
  @IsOptional()
  location_id: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  images: string[];
}
