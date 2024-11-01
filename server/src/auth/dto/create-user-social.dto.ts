import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateUserSocialDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  platform: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirm_password: string;
}
