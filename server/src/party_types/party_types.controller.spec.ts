import { Test, TestingModule } from '@nestjs/testing';
import { PartyTypesController } from './party_types.controller';
import { PartyTypesService } from './party_types.service';

describe('PartyTypesController', () => {
  let controller: PartyTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartyTypesController],
      providers: [PartyTypesService],
    }).compile();

    controller = module.get<PartyTypesController>(PartyTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
