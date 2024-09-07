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
  Put,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';

@ApiTags('menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // ! Create Menu
  @Post('create')
  @ApiOperation({ summary: 'Thêm mới menu' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  // ! Get All Menu
  @Get('get-all')
  @ApiOperation({ summary: 'Lấy danh sách menu' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAll(@Query() query: FilterPriceDto) {
    return this.menusService.findAll(query);
  }

  // ! Get All Menu Deleted
  @Get('get-all-deleted')
  @ApiOperation({ summary: 'Lấy danh sách menu đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAllDeleted(@Query() query: FilterPriceDto) {
    return this.menusService.findAllDeleted(query);
  }

  // ! Get Menu By Id
  @Get('get/:menu_id')
  @ApiOperation({ summary: 'Lấy menu theo id' })
  findOne(@Param('menu_id') id: number) {
    return this.menusService.findOne(id);
  }

  // ! Get Menu By Slug
  @Get('get-by-slug/:slug')
  @ApiOperation({ summary: 'Lấy menu theo slug' })
  findOneBySlug(@Param('slug') slug: string) {
    return this.menusService.findBySlug(slug);
  }

  // ! Update Menu
  @Patch('update/:menu_id')
  @ApiOperation({ summary: 'Cập nhật menu' })
  update(@Param('menu_id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  // ! Soft Delete Menu
  @Delete('delete/:menu_id')
  @ApiOperation({ summary: 'Xóa tạm menu' })
  remove(@Request() req, @Param('menu_id') id: string) {
    return this.menusService.remove(req.user, +id);
  }

  // ! Restore Menu
  @Put('restore/:menu_id')
  @ApiOperation({ summary: 'Khôi phục menu' })
  restore(@Param('menu_id') id: string) {
    return this.menusService.restore(+id);
  }

  // ! Delete Menu
  @Delete('destroy/:menu_id')
  @ApiOperation({ summary: 'Xóa vĩnh viễn menu' })
  delete(@Param('menu_id') id: string) {
    return this.menusService.destroy(+id);
  }
}
