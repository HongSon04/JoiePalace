import { Test, TestingModule } from '@nestjs/testing';
import { CategoryBlogsController } from './category_blogs.controller';
import { CategoryBlogsService } from './category_blogs.service';

describe('CategoryBlogsController', () => {
  let controller: CategoryBlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryBlogsController],
      providers: [CategoryBlogsService],
    }).compile();

    controller = module.get<CategoryBlogsController>(CategoryBlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
