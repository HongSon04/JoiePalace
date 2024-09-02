import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeLocationDto {
  @IsNotEmpty({ message: 'Địa điểm không được để trống' })
  @ApiProperty()
  location_id: number;
}
