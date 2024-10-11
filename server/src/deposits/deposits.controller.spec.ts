import { Test, TestingModule } from '@nestjs/testing';
import { DepositsController } from './deposits.controller';
import { DepositsService } from './deposits.service';

describe('DepositsController', () => {
  let controller: DepositsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositsController],
      providers: [DepositsService],
    }).compile();

    controller = module.get<DepositsController>(DepositsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
