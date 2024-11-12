import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteMultipleImagesByUrlDto {
  @IsNotEmpty({ message: 'Không được để trống booking_id' })
  booking_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ message: 'Không được để trống urls' })
  urls: string[];
}
