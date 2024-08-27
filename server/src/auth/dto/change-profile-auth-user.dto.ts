import { ApiProperty } from '@nestjs/swagger';

export class ChangeProfileAuthUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  phone: string;
}
