import { Test, TestingModule } from '@nestjs/testing';
import { DecorsController } from './decors.controller';
import { DecorsService } from './decors.service';

describe('DecorsController', () => {
  let controller: DecorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecorsController],
      providers: [DecorsService],
    }).compile();

    controller = module.get<DecorsController>(DecorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
