import { PartialType } from '@nestjs/swagger';
import { CreateDecorDto } from './create-decor.dto';

export class UpdateDecorDto extends PartialType(CreateDecorDto) {}
