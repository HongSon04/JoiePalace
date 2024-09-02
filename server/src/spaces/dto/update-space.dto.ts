import { ApiProperty } from '@nestjs/swagger';

export class updateSpaceDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  images: string;
}
