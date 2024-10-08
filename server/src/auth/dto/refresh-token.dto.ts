import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refresh_token: string;
}
