import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';

import { FilterDto } from 'helper/dto/Filter.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { ImageUploadBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { isPublic } from 'decorator/auth.decorator';

@ApiTags('branches')
@UseGuards(AuthGuard)
@Controller('api/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  // ! Create A New Branch
  @Post('create')
  @ApiOperation({ summary: 'Tạo chi nhánh mới' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    example: {
      message: 'Thêm địa điểm thành công',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        slogan_description: 'string',
        slogan_images: ['string', 'string'],
        diagram_description: 'string',
        diagram_images: ['string', 'string'],
        equipment_description: 'string',
        equipment_images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Tên chi nhánh đã tồn tại !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy ảnh nào được tải lên !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'slogan_images', maxCount: 5 },
        { name: 'diagram_images', maxCount: 5 },
        { name: 'equipment_images', maxCount: 5 },
        { name: 'space_images', maxCount: 5 },
      ],
      {
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
          }
          cb(null, true);
        },
      },
    ),
  )
  async createBranch(
    @Body() Branch: CreateBranchDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      slogan_images?: Express.Multer.File[];
      diagram_images?: Express.Multer.File[];
      equipment_images?: Express.Multer.File[];
      space_images?: Express.Multer.File[];
    },
  ): Promise<CreateBranchDto | any> {
    return this.branchesService.createBranch(
      Branch,
      files as ImageUploadBranchDto,
    );
  }

  // ! Get All Branchs
  @Get('get-all')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          address: 'string',
          phone: 'string',
          email: 'string',
          rate: 'number',
          images: ['string', 'string'],
          slogan_description: 'string',
          slogan_images: ['string', 'string'],
          diagram_description: 'string',
          diagram_images: ['string', 'string'],
          equipment_description: 'string',
          equipment_images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
          space: [
            {
              id: 'number',
              branch_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
          stages: [
            {
              id: 'number',
              branch_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        total: 'number',
        prevPage: 'number',
        nextPage: 'number',
        lastPage: 'number',
      },
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách tất cả chi nhánh (trừ đã xóa tạm)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  async getAllBranchs(@Query() query: FilterDto): Promise<any> {
    return this.branchesService.getAllBranches(query);
  }

  // ! Get All Branchs (Deleted)
  @Get('get-all-deleted')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: [
        {
          id: 'number',
          name: 'string',
          slug: 'string',
          address: 'string',
          phone: 'string',
          email: 'string',
          rate: 'number',
          images: ['string', 'string'],
          slogan_description: 'string',
          slogan_images: ['string', 'string'],
          diagram_description: 'string',
          diagram_images: ['string', 'string'],
          equipment_description: 'string',
          equipment_images: ['string', 'string'],
          created_at: 'date',
          updated_at: 'date',
          space: [
            {
              id: 'number',
              branch_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
          stages: [
            {
              id: 'number',
              branch_id: 'number',
              name: 'string',
              slug: 'string',
              description: 'string',
              images: ['string', 'string'],
              created_at: 'date',
              updated_at: 'date',
            },
          ],
        },
      ],
      pagination: {
        currentPage: 'number',
        itemsPerPage: 'number',
        total: 'number',
        prevPage: 'number',
        nextPage: 'number',
        lastPage: 'number',
      },
    },
  })
  @ApiOperation({ summary: 'Lấy danh sách chi nhánh đã xóa tạm' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'startDate', required: false, description: '28-10-2024' })
  @ApiQuery({ name: 'endDate', required: false, description: '28-10-2024' })
  async getAllDeletedBranches(@Query() query: FilterDto): Promise<any> {
    return this.branchesService.getAllDeletedBranches(query);
  }

  // ! Get Branch By Id
  @Get('get/:branch_id')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        slogan_description: 'string',
        slogan_images: ['string', 'string'],
        diagram_description: 'string',
        diagram_images: ['string', 'string'],
        equipment_description: 'string',
        equipment_images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',
        space: [
          {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
        stages: [
          {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin chi nhánh theo ID' })
  async getBranchById(@Param('branch_id') id: number) {
    return this.branchesService.getBranchById(id);
  }

  // ! Get Branch By Slug
  @Get('get-by-slug/:branch_slug')
  @isPublic()
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        slogan_description: 'string',
        slogan_images: ['string', 'string'],
        diagram_description: 'string',
        diagram_images: ['string', 'string'],
        equipment_description: 'string',
        equipment_images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',
        space: [
          {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
        stages: [
          {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Lấy thông tin chi nhánh theo Slug' })
  async getBranchBySlug(@Param('branch_slug') slug: string) {
    return this.branchesService.getBranchBySlug(slug);
  }

  // ! Update Branch Info
  @Patch('update/:branch_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Cập nhật thông tin chi nhánh thành công !',
      data: {
        id: 'number',
        name: 'string',
        slug: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        rate: 'number',
        images: ['string', 'string'],
        created_at: 'date',
        updated_at: 'date',

        space: [
          {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
            created_at: 'date',
            updated_at: 'date',
          },
        ],
        stages: [
          {
            id: 'number',
            branch_id: 'number',
            name: 'string',
            slug: 'string',
            description: 'string',
            images: ['string', 'string'],
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
      message: 'Tên chi nhánh đã tồn tại !',
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    example: {
      message: 'Không tìm thấy ảnh nào được tải lên !',
    },
  })
  @ApiOperation({ summary: 'Cập nhật thông tin chi nhánh' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'slogan_images', maxCount: 5 },
        { name: 'diagram_images', maxCount: 5 },
        { name: 'equipment_images', maxCount: 5 },
        { name: 'space_images', maxCount: 5 },
      ],
      {
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
          }
          cb(null, true);
        },
      },
    ),
  )
  async updateBranch(
    @Param('branch_id') branch_id: number,
    @Body() Branch: UpdateBranchDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      slogan_images?: Express.Multer.File[];
      diagram_images?: Express.Multer.File[];
      equipment_images?: Express.Multer.File[];
      space_images?: Express.Multer.File[];
    },
  ): Promise<UpdateBranchDto | any> {
    return this.branchesService.updateBranch(
      branch_id,
      Branch,
      files as ImageUploadBranchDto,
    );
  }

  // ! Soft Delete Branch
  @Delete('delete/:branch_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa chi nhánh thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa tạm chi nhánh' })
  async softDeleteBranch(
    @Request() req,
    @Param('branch_id') id: number,
  ): Promise<any> {
    return this.branchesService.softDeleteBranch(req.user, id);
  }

  // ! Restore Branch
  @Put('restore/:branch_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Khôi phục chi nhánh thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Khôi phục chi nhánh đã xóa tạm' })
  async restoreBranch(@Param('branch_id') id: number): Promise<any> {
    return this.branchesService.restoreBranch(id);
  }

  // ! Hard Delete Branch
  @Delete('destroy/:branch_id')
  @ApiResponse({
    status: HttpStatus.OK,
    example: {
      message: 'Xóa vĩnh viễn chi nhánh thành công !',
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Không tìm thấy chi nhánh !',
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    example: {
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau !',
    },
  })
  @ApiOperation({ summary: 'Xóa vĩnh viễn chi nhánh' })
  async hardDeleteBranch(@Param('branch_id') id: number): Promise<any> {
    return this.branchesService.hardDeleteBranch(id);
  }

  // ! Delete Image By Url
  /* @Delete('delete-image')
  @ApiOperation({ summary: 'Xóa ảnh theo URL' })
  async deleteImageByUrl(@Body() image_url: DeleteImageDto): Promise<any> {
    return this.branchesService.deleteImageByUrl(image_url);
  } */
}
