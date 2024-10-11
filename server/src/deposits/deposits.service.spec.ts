import { Test, TestingModule } from '@nestjs/testing';
import { DepositsService } from './deposits.service';

describe('DepositsService', () => {
  let service: DepositsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepositsService],
    }).compile();

    service = module.get<DepositsService>(DepositsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
