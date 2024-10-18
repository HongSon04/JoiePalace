import { Test, TestingModule } from '@nestjs/testing';
import { CategoryBlogsService } from './category_blogs.service';

describe('CategoryBlogsService', () => {
  let service: CategoryBlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryBlogsService],
    }).compile();

    service = module.get<CategoryBlogsService>(CategoryBlogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
