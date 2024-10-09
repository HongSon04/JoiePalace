import { ApiProperty } from '@nestjs/swagger';

export class updateSpaceDto {
  @ApiProperty({ required: true })
  name: string;
  @ApiProperty({ required: true })
  description: string;
  @ApiProperty({ required: true })
  images: string;
}
