import { PartialType } from '@nestjs/swagger';
import { CreateFunitureDto } from './create-funiture.dto';

export class UpdateFunitureDto extends PartialType(CreateFunitureDto) {}
