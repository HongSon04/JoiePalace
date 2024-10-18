import { PartialType } from '@nestjs/swagger';
import { CreateCategoryBlogDto } from './create-category_blog.dto';

export class UpdateCategoryBlogDto extends PartialType(CreateCategoryBlogDto) {}
