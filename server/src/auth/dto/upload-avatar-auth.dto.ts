import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarAuthDto {
  @ApiProperty({ required: true })
  avatar: string;
}
