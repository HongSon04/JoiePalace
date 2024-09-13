import { Test, TestingModule } from '@nestjs/testing';
import { DecorsService } from './decors.service';

describe('DecorsService', () => {
  let service: DecorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecorsService],
    }).compile();

    service = module.get<DecorsService>(DecorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
