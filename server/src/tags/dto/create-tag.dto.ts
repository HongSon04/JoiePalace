import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Tên thẻ không được để trống' })
  name: string;
}
