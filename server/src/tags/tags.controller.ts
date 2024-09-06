import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterDto } from 'helper/dto/Filter.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // ! Add Tag
  @Post('create')
  @ApiOperation({ summary: 'Tạo tag' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  // ! Get All Tags
  @Get('/get-all')
  @ApiOperation({ summary: 'Lấy danh sách tag' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query: FilterDto): Promise<any> {
    return this.tagsService.findAll(query);
  }

  @Get('/get/:tag_id')
  @ApiOperation({ summary: 'Lấy tag theo id' })
  findOne(@Param('tag_id') id: number) {
    return this.tagsService.findOne(id);
  }

  @Get('/get-slug/:slug')
  @ApiOperation({ summary: 'Lấy tag theo slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.tagsService.findBySlug(slug);
  }

  @Patch('/update/:tag_id')
  @ApiOperation({ summary: 'Cập nhật tag' })
  update(@Param('tag_id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete('/destroy/:tag_id')
  @ApiOperation({ summary: 'Xóa tag' })
  remove(@Param('tag_id') id: string) {
    return this.tagsService.remove(+id);
  }
}
