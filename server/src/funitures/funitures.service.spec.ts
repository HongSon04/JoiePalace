import { Test, TestingModule } from '@nestjs/testing';
import { FunituresService } from './funitures.service';

describe('FunituresService', () => {
  let service: FunituresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunituresService],
    }).compile();

    service = module.get<FunituresService>(FunituresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
