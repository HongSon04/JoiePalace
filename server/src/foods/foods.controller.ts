import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFiles,
  Query,
  Request,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';

@ApiTags('foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  // ! Create food
  @Post('create')
  @ApiOperation({ summary: 'Tạo món ăn' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Chỉ chấp nhận ảnh jpg, jpeg, png',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(
            new HttpException(
              'Kích thước ảnh tối đa 5MB',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  create(
    @Body() createFoodDto: CreateFoodDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.foodsService.create(createFoodDto, files);
  }

  // ! Get all food
  @Get('/get-all')
  @ApiOperation({ summary: 'Lấy danh sách món ăn' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAll(@Query() query: FilterPriceDto) {
    return this.foodsService.findAll(query);
  }

  // ! Get All Food Deleted
  @Get('/get-all-deleted')
  @ApiOperation({ summary: 'Lấy danh sách món ăn đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAllDeleted(@Query() query: FilterPriceDto) {
    return this.foodsService.findAllDeleted(query);
  }

  // ! Get food by id
  @Get(':food_id')
  @ApiOperation({ summary: 'Lấy món ăn theo id' })
  findOne(@Param('food_id') id: number) {
    return this.foodsService.findOne(id);
  }

  // ! Get food by slug
  @Get('get-by-slug/:slug')
  @ApiOperation({ summary: 'Lấy món ăn theo slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.foodsService.findBySlug(slug);
  }

  // ! Get Food By Category Id
  @Get('get-by-category/:category_id')
  @ApiOperation({ summary: 'Lấy món ăn theo id danh mục' })
  findByCategoryId(@Param('category_id') category_id: number) {
    return this.foodsService.findByCategoryId(category_id);
  }

  // ! Get Food By Tag Id
  @Get('get-by-tag/:tag_id')
  @ApiOperation({ summary: 'Lấy món ăn theo id tag' })
  findByTagId(@Param('tag_id') tag_id: number) {
    return this.foodsService.findByTagId(tag_id);
  }

  // ! Update food
  @Patch('/update/:food_id')
  @ApiOperation({ summary: 'Cập nhật món ăn' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(
            new HttpException(
              'Chỉ chấp nhận ảnh jpg, jpeg, png',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else if (file.size > 1024 * 1024 * 5) {
          return cb(
            new HttpException(
              'Kích thước ảnh tối đa 5MB',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  update(
    @Param('food_id') id: number,
    @Body() updateFoodDto: UpdateFoodDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.foodsService.update(id, updateFoodDto, files);
  }

  // ! Soft delete food
  @Delete('/delete/:food_id')
  @ApiOperation({ summary: 'Xóa món ăn' })
  removeFood(@Request() req, @Param('food_id') id: number) {
    return this.foodsService.removeFood(req.user, id);
  }

  // ! Restore food
  @Post('/restore/:food_id')
  @ApiOperation({ summary: 'Khôi phục món ăn đã xóa' })
  restoreFood(@Param('food_id') id: number) {
    return this.foodsService.restoreFood(id);
  }

  // ! Delete food
  @Delete('/destroy/:food_id')
  @ApiOperation({ summary: 'Xóa vĩnh viễn món ăn' })
  deleteFood(@Param('food_id') id: number) {
    return this.foodsService.destroy(id);
  }
}
