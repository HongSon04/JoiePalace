import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarAuthDto {
  @ApiProperty()
  avatar: string;
}
