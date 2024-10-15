import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateDepositDto } from './dto/update-status.dto';

@ApiTags('deposits')
@Controller('api/deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  // ? Find By ID
  @Get('get/:id')
  findOneById(@Param('id') id: string) {
    return this.depositsService.findOne(+id);
  }

  // ? Find By Transaction ID
  @Get('transaction/:transactionID')
  findOneByTransactionId(@Param('transactionID') transactionID: string) {
    return this.depositsService.findOneByTransactionId(transactionID);
  }

  // ? Update
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateDepositDto: UpdateDepositDto,
  ) {
    return this.depositsService.update(+id, updateDepositDto);
  }

  // ? Update  by Transaction ID
  @Patch('update/transaction/:transactionID')
  updateByTransactionID(
    @Param('transactionID') transactionID: string,
    @Body() updateDepositDto: UpdateDepositDto,
  ) {
    return this.depositsService.updateByTransactionID(
      transactionID,
      updateDepositDto,
    );
  }
}
