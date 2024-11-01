import { ApiProperty } from '@nestjs/swagger';

export class LoginUserSocialDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  platform: string;
}
