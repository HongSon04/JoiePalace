import { ApiProperty } from '@nestjs/swagger';

export class FilterPackagesDto {
  @ApiProperty()
  is_show: boolean;

  @ApiProperty()
  deleted: boolean;
}
