import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ required: true })
  image: string;
}

export class DeleteImageDto {
  @ApiProperty({ required: true })
  image_url: string;
}
