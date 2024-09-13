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
  Put,
} from '@nestjs/common';
import { PartyTypesService } from './party_types.service';
import {
  CreatePartyTypeDto,
  ImagePartyTypesDto,
} from './dto/create-party_type.dto';
import { UpdatePartyTypeDto } from './dto/update-party_type.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterDto } from 'helper/dto/Filter.dto';

@ApiTags('party-types')
@Controller('party-types')
export class PartyTypesController {
  constructor(private readonly partyTypesService: PartyTypesService) {}

  // ! Create party type
  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Thêm mới loại tiệc thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên loại tiệc đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Tạo loại tiệc' })
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
    @Body() createPartyTypeDto: CreatePartyTypeDto,
    @UploadedFiles() files: ImagePartyTypesDto,
  ) {
    return this.partyTypesService.create(createPartyTypeDto, files);
  }

  // ! Get all party types
  @Get('get-all')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
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
  @ApiOperation({ summary: 'Lấy tất cả loại tiệc' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query: FilterDto) {
    return this.partyTypesService.findAll(query);
  }

  // ! Get all party types deleted
  @Get('get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy tất cả loại tiệc đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllDeleted(@Query() query: FilterDto) {
    return this.partyTypesService.findAllDeleted(query);
  }

  // ! Get party type by id
  @Get('get/:party_types_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Loại tiệc không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy loại tiệc theo id' })
  findOne(@Param('party_types_id') id: number) {
    return this.partyTypesService.findOne(id);
  }

  // ! Get party type by slug
  @Get('get-by-slug/:slug')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Loại tiệc không tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Lấy loại tiệc theo slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.partyTypesService.findBySlug(slug);
  }
  // ! Update party type
  @Patch('update/:party_types_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        description: 'string',
        short_description: 'string',
        images: 'array',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên loại tiệc đã tồn tại',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Cập nhật loại tiệc' })
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
    @Param('party_types_id') id: number,
    @Body() updatePartyTypeDto: UpdatePartyTypeDto,
    files: ImagePartyTypesDto,
  ) {
    return this.partyTypesService.update(id, updatePartyTypeDto, files);
  }

  // ! Soft delete party type
  @Delete('delete/:party_types_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa tạm loại tiệc thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy loại tiệc',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm loại tiệc' })
  remove(@Request() req, @Param('party_types_id') id: number) {
    return this.partyTypesService.remove(req.user, id);
  }

  // ! Restore party type
  @Put('restore/:party_types_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục loại tiệc thành công',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy loại tiệc',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Lỗi server vui lòng thử lại sau',
    },
  })
  @ApiOperation({ summary: 'Khôi phục loại tiệc' })
  restore(@Param('party_types_id') id: number) {
    return this.partyTypesService.restore(id);
  }

  // ! Hard delete party type
  @Delete('hard-delete/:party_types_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: { message: 'Xóa loại tiệc thành công' },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: { message: 'Không tìm thấy loại tiệc' },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: { message: 'Lỗi server vui lòng thử lại sau' },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn loại tiệc' })
  destroy(@Param('party_types_id') id: number) {
    return this.partyTypesService.destroy(id);
  }
}
