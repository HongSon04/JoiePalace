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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterPriceDto } from 'helper/dto/FilterPrice.dto';

@ApiTags('foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  // ! Create food
  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo món ăn thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        price: 'number',
        images: 'array',
        description: 'string',
        short_description: 'string',
        category_id: 'number',
        tags: 'array',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên món ăn đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Danh mục không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tag không tồn tại',
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách món ăn thành công',
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          price: 'number',
          images: 'array',
          description: 'string',
          short_description: 'string',
          category_id: 'number',
          tags: 'array',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
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
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách món ăn' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false, example: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, example: '28-10-2024' })
  findAll(@Query() query: FilterPriceDto) {
    return this.foodsService.findAll(query);
  }

  // ! Get All Food Deleted
  @Get('/get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy danh sách món ăn đã xóa thành công',
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          price: 'number',
          images: 'array',
          description: 'string',
          short_description: 'string',
          category_id: 'number',
          tags: 'array',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
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
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn đã xóa',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách món ăn đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAllDeleted(@Query() query: FilterPriceDto) {
    return this.foodsService.findAllDeleted(query);
  }

  // ! Get food by id
  @Get('get/:food_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy món ăn thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        price: 'number',
        images: 'array',
        description: 'string',
        short_description: 'string',
        category_id: 'number',
        tags: 'array',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy món ăn theo id' })
  findOne(@Param('food_id') id: number) {
    return this.foodsService.findOne(id);
  }

  // ! Get food by slug
  @Get('get-by-slug/:slug')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy món ăn thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        price: 'number',
        images: 'array',
        description: 'string',
        short_description: 'string',
        category_id: 'number',
        tags: 'array',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy món ăn theo slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.foodsService.findBySlug(slug);
  }

  // ! Get Food By Category Id
  @Get('get-by-category/:category_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy món ăn thành công',
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          price: 'number',
          images: 'array',
          description: 'string',
          short_description: 'string',
          category_id: 'number',
          tags: 'array',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
    },
  })
  @ApiOperation({ summary: 'Lấy món ăn theo id danh mục' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findByCategoryId(
    @Query() query: FilterPriceDto,
    @Param('category_id') category_id: number,
  ) {
    return this.foodsService.findByCategoryId(query, category_id);
  }

  // ! Get Food By Tag Id
  @Get('get-by-tag/:tag_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Lấy món ăn thành công',
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          price: 'number',
          images: 'array',
          description: 'string',
          short_description: 'string',
          category_id: 'number',
          tags: 'array',
          created_at: 'date',
          updated_at: 'date',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiOperation({ summary: 'Lấy món ăn theo id tag' })
  findByTagId(@Query() query: FilterPriceDto, @Param('tag_id') tag_id: number) {
    return this.foodsService.findByTagId(query, tag_id);
  }

  // ! Update food
  @Patch('/update/:food_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật món ăn thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        price: 'number',
        images: 'array',
        description: 'string',
        short_description: 'string',
        category_id: 'number',
        tags: 'array',
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên món ăn đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Danh mục không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa món ăn thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa món ăn' })
  removeFood(@Request() req, @Param('food_id') id: number) {
    return this.foodsService.removeFood(req.user, id);
  }

  // ! Restore food
  @Post('/restore/:food_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục món ăn thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục món ăn đã xóa' })
  restoreFood(@Param('food_id') id: number) {
    return this.foodsService.restoreFood(id);
  }

  // ! Delete food
  @Delete('/destroy/:food_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn món ăn thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy món ăn',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn món ăn' })
  deleteFood(@Param('food_id') id: number) {
    return this.foodsService.destroy(id);
  }
}
