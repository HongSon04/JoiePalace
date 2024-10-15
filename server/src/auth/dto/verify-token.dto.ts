import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDto {
  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  token: string;
}
