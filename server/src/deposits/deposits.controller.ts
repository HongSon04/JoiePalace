import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('deposits')
@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositsService.create(createDepositDto);
  }

  @Get()
  findAll() {
    return this.depositsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositsService.update(+id, updateDepositDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositsService.remove(+id);
  }
}
