import { ApiProperty } from '@nestjs/swagger';

export class UpdateAvatarStaffDto {
  @ApiProperty({ required: true })
  avatar: string;
}
