import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeBranchDto {
  @IsNotEmpty({ message: 'Địa điểm không được để trống' })
  @ApiProperty({ required: true })
  branch_id: number;
}
