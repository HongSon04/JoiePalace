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
  @Get('get/:id')
  @ApiOperation({ summary: 'Lấy thông tin danh mục theo ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  // ! Update Category
  @Patch('update/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin danh mục' })
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  // ! Delete Category
  @Delete('delete/:id')
  @ApiOperation({ summary: 'Xóa tạm thời danh mục' })
  softDelete(@Request() req, @Param('id') id: number) {
    return this.categoriesService.softDelete(req.user, id);
  }

  // ! Restore Category
  @Post('restore/:id')
  @ApiOperation({ summary: 'Khôi phục danh mục đã xóa' })
  restore(@Param('id') id: number) {
    return this.categoriesService.restore(id);
  }

  // ! Delete Category
  @Delete('destroy/:id')
  @ApiOperation({ summary: 'Xóa vĩnh viễn danh mục' })
  remove(@Param('id') id: number) {
    return this.categoriesService.destroy(id);
  }
}
