import { Test, TestingModule } from '@nestjs/testing';
import { PartyTypesService } from './party_types.service';

describe('PartyTypesService', () => {
  let service: PartyTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartyTypesService],
    }).compile();

    service = module.get<PartyTypesService>(PartyTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
