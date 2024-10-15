import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Tên thẻ không được để trống' })
  name: string;
}
