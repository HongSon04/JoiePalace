import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'helper/dto/Filter.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ! Add Category
  @Post()
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  // ! Get All Category
  @Get('/get-all')
  @ApiOperation({ summary: 'Lấy tất cả danh mục' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query: FilterDto) {
    return this.categoriesService.findAll(query);
  }

  // ! Get All Category Deleted
  @Get('/get-all-deleted')
  @ApiOperation({ summary: 'Lấy tất cả danh mục đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllDeleted(@Query() query: FilterDto) {
    return this.categoriesService.findAllDeleted(query);
  }

  // ! Get Category By Id
  @Get('get/:category_id')
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  findOne(@Param('category_id') id: number) {
    return this.categoriesService.findOne(id);
  }

  // ! Get Category By Slug
  @Get('get-slug/:slug')
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo slug' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findOneBySlug(slug);
  }

  // ! Update Category
  @Patch('update/:category_id')
  @ApiOperation({ summary: 'Cập nhật thông tin danh mục' })
  update(
    @Param('category_id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // ! Delete Category
  @Delete('delete/:category_id')
  @ApiOperation({ summary: 'Xóa tạm thời danh mục' })
  softDelete(@Request() req, @Param('category_id') id: number) {
    return this.categoriesService.softDelete(req.user, id);
  }

  // ! Restore Category
  @Post('restore/:category_id')
  @ApiOperation({ summary: 'Khôi phục danh mục đã xóa' })
  restore(@Param('category_id') id: number) {
    return this.categoriesService.restore(id);
  }

  // ! Delete Category
  @Delete('destroy/:category_id')
  @ApiOperation({ summary: 'Xóa vĩnh viễn danh mục' })
  remove(@Param('category_id') id: number) {
    return this.categoriesService.destroy(id);
  }
}
