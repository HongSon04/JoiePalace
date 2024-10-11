import { ApiProperty } from '@nestjs/swagger';

export class ChangeProfileAuthUserDto {
  @ApiProperty({ required: true })
  username: string;

  @ApiProperty({ required: true })
  phone: string;
}
