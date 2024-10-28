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
  HttpStatus,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';
import { isPublic } from 'decorator/auth.decorator';

@ApiTags('Menus - Quản lý thực đơn')
@Controller('api/menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // ! Create Menu
  @Post('create')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Thêm mới menu thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        foods: 'array',
        is_show: 'boolean',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên menu đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Thêm mới menu' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  // ! Get All Menu
  @Get('get-all')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        foods: 'array',
        is_show: 'boolean',
      },
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        total: 'number',
        lastPage: 'number',
        nextPage: 'number',
        prevPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách menu' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  findAll(@Query() query: FilterPriceDto) {
    return this.menusService.findAll(query);
  }

  // ! Get All Menu Deleted
  @Get('get-all-deleted')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        foods: 'array',
        is_show: 'boolean',
      },
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        total: 'number',
        lastPage: 'number',
        nextPage: 'number',
        prevPage: 'number',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách menu đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  findAllDeleted(@Query() query: FilterPriceDto) {
    return this.menusService.findAllDeleted(query);
  }

  // ! Get Menu By Id
  @Get('get/:menu_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        foods: 'array',
        is_show: 'boolean',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy menu',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy menu theo id' })
  findOne(@Param('menu_id') id: number) {
    return this.menusService.findOne(id);
  }

  // ! Get Menu By Slug
  @Get('get-by-slug/:menu_slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        foods: 'array',
        is_show: 'boolean',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy menu',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy menu theo slug' })
  findOneBySlug(@Param('menu_slug') slug: string) {
    return this.menusService.findBySlug(slug);
  }

  // ! Update Menu
  @Patch('update/:menu_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật menu thành công',
      data: {
        id: 'number',
        name: 'string',
        price: 'number',
        slug: 'string',
        description: 'string',
        foods: 'array',
        is_show: 'boolean',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên menu đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy menu',
    },
  })
  @ApiOperation({ summary: 'Cập nhật menu' })
  update(@Param('menu_id') id: number, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(id, updateMenuDto);
  }

  // ! Soft Delete Menu
  @Delete('delete/:menu_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa tạm menu thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy menu',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm menu' })
  remove(@Request() req, @Param('menu_id') id: string) {
    return this.menusService.remove(req.user, +id);
  }

  // ! Restore Menu
  @Put('restore/:menu_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục menu thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy menu',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục menu' })
  restore(@Param('menu_id') id: string) {
    return this.menusService.restore(+id);
  }

  // ! Delete Menu
  @Delete('destroy/:menu_id')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn menu thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy menu',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn menu' })
  delete(@Param('menu_id') id: string) {
    return this.menusService.destroy(+id);
  }
}
