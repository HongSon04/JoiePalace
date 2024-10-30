import { ApiProperty } from '@nestjs/swagger';
import { CategoryResDto } from 'src/categories/dto/category.res.dto';
import { TagResDto } from 'src/tags/dto/tag.res.dto';

export class BlogResDto {
  id: number;

  category_id: number;

  category: CategoryResDto;

  title: string;

  slug: string;

  content: string;

  description: string;

  short_description: string;

  images: string[];

  tags: TagResDto[];

  views: number;

  created_at: Date;

  updated_at: Date;
}
