import { Test, TestingModule } from '@nestjs/testing';
import { StaffsController } from './staffs.controller';
import { StaffsService } from './staffs.service';

describe('StaffsController', () => {
  let controller: StaffsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffsController],
      providers: [StaffsService],
    }).compile();

    controller = module.get<StaffsController>(StaffsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
