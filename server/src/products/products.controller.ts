import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiHeaders,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { isPublic } from 'decorator/auth.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { FilterProductDto } from './dto/FilterProduct.dto';

@ApiTags('Products - Quản lý sản phẩm')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ! Create Product
  @Post('create')
  @ApiHeaders([
    {
      name: 'authorization',
      description: 'Bearer token',
      required: false,
    },
  ])
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Tạo sản phẩm thành công',
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
      message: 'Tên sản phẩm đã tồn tại',
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
  @ApiOperation({ summary: 'Tạo sản phẩm' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        if (!file || req.files.images.length === 0) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 6) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 6 ảnh'),
            false,
          );
        }
        for (const f of files) {
          if (!f.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
              false,
            );
          }
          if (f.size > 1024 * 1024 * 10) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 10MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.productsService.create(createProductDto, files);
  }

  // ! Get all products
  @Get('/get-all')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
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
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2004' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'category_id', required: false, description: '1' })
  findAll(@Query() query: FilterProductDto) {
    return this.productsService.findAll(query);
  }

  // ! Get All product Deleted
  @Get('/get-all-deleted')
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
      message: 'Không tìm thấy sản phẩm đã xóa',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'category_id', required: false, description: '1' })
  findAllDeleted(@Query() query: FilterProductDto) {
    return this.productsService.findAllDeleted(query);
  }

  // ! Get Services
  @Get('/get-services')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        'thuc-an': [
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
        'thuc-uong': [
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
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm theo danh mục' })
  getServices() {
    return this.productsService.getServices();
  }

  // ! Get 10 product per category
  @Get('/get-ten-per-category')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
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
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy 10 sản phẩm mới nhất của mỗi danh mục' })
  get10PerCategory() {
    return this.productsService.get10PerCategory();
  }
  // ! Get product by id
  @Get('get/:product_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
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
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy sản phẩm theo id' })
  findOne(@Param('product_id') id: number) {
    return this.productsService.findOne(id);
  }

  // ! Get product by slug
  @Get('get-by-slug/:product_slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
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
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy sản phẩm theo slug' })
  findBySlug(@Param('product_slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  // ! Get product By Category Id
  @Get('get-by-category/:category_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
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
  @ApiOperation({ summary: 'Lấy sản phẩm theo id danh mục' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'priceSort', required: false, description: 'ASC | DESC' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'deleted', required: false })
  findByCategoryId(
    @Query() query: FilterProductDto,
    @Param('category_id') category_id: string,
  ) {
    return this.productsService.findByCategoryId(query, category_id);
  }

  // ! Get product By Tag Id
  @Get('get-by-tag/:tag_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
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
      message: 'Không tìm thấy sản phẩm',
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
  @ApiOperation({ summary: 'Lấy sản phẩm theo id tag' })
  findByTagId(
    @Query() query: FilterProductDto,
    @Param('tag_id') tag_id: number,
  ) {
    return this.productsService.findByTagId(query, tag_id);
  }

  // ! Update product
  @Patch('/update/:product_id')
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
      message: 'Cập nhật sản phẩm thành công',
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
      message: 'Tên sản phẩm đã tồn tại',
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
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 6 }], {
      fileFilter: (req, file, cb) => {
        if (!file || req.files.images.length === 0) {
          return cb(
            new BadRequestException('Không có tệp nào được tải lên'),
            false,
          );
        }
        const files = Array.isArray(file) ? file : [file];
        if (req.files && req.files.images && req.files.images.length >= 6) {
          return cb(
            new BadRequestException('Chỉ chấp nhận tối đa 6 ảnh'),
            false,
          );
        }
        for (const f of files) {
          if (!f.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(
              new BadRequestException('Chỉ chấp nhận ảnh jpg, jpeg, png'),
              false,
            );
          }
          if (f.size > 1024 * 1024 * 10) {
            return cb(
              new BadRequestException('Kích thước ảnh tối đa 10MB'),
              false,
            );
          }
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('product_id') id: number,
    @Body() updateproductDto: UpdateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    return this.productsService.update(id, updateproductDto, files);
  }

  // ! Soft delete product
  @Delete('/delete/:product_id')
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
      message: 'Xóa sản phẩm thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  deleteProduct(@Request() req, @Param('product_id') id: number) {
    return this.productsService.deleteProduct(req.user, id);
  }

  // ! Restore product
  @Post('/restore/:product_id')
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
      message: 'Khôi phục sản phẩm thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục sản phẩm đã xóa' })
  restoreproduct(@Param('product_id') id: number) {
    return this.productsService.restoreproduct(id);
  }

  // ! Delete product
  @Delete('/destroy/:product_id')
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
      message: 'Xóa vĩnh viễn sản phẩm thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy sản phẩm',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn sản phẩm' })
  destroyProduct(@Param('product_id') id: number) {
    return this.productsService.destroy(id);
  }
}
