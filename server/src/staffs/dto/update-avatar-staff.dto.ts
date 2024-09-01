import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarStaffDto {
  @ApiProperty()
  avatar: string;
}
