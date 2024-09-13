import { Test, TestingModule } from '@nestjs/testing';
import { FunituresController } from './funitures.controller';
import { FunituresService } from './funitures.service';

describe('FunituresController', () => {
  let controller: FunituresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunituresController],
      providers: [FunituresService],
    }).compile();

    controller = module.get<FunituresController>(FunituresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
