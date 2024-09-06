import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty()
  image: string;
}

export class DeleteImageDto {
  @ApiProperty()
  image_url: string;
}
