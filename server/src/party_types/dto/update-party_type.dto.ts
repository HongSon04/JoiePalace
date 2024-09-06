import { PartialType } from '@nestjs/swagger';
import { CreatePartyTypeDto } from './create-party_type.dto';

export class UpdatePartyTypeDto extends PartialType(CreatePartyTypeDto) {}
