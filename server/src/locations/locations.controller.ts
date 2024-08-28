import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationEntity } from './entities/location.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateLocationDto } from './dto/create-location.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('location')
@UseGuards(AuthGuard)
@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // ! Create A New Location
  @Post('create')
  async createLocation(
    @Body() location: CreateLocationDto,
  ): Promise<LocationEntity | any> {
    return this.locationsService.createLocation(location);
  }

  // ! Get All Locations
  @Get('get-all')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllLocations(@Query() query: FilterDto): Promise<any> {
    return this.locationsService.getAllLocations(query);
  }

  // ! Get All Locations (Deleted)
  @Get('get-all-deleted')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllDeletedLocations(@Query() query: FilterDto): Promise<any> {
    return this.locationsService.getAllDeletedLocations(query);
  }

  // ! Get Location By Id
  @Get('get/:id')
  async getLocationById(
    @Param('id') id: number,
  ): Promise<LocationEntity | any> {
    return this.locationsService.getLocationById(id);
  }

  // ! Change Location Info
  @Patch('update/:id')
  async updateLocation(
    @Param('id') id: number,
    @Body() location: UpdateLocationDto,
  ): Promise<LocationEntity | any> {
    return this.locationsService.updateLocation(location, id);
  }

  // ! Soft Delete Location
  @Delete('soft-delete/:id')
  async softDeleteLocation(
    @Request() req,
    @Param('id') id: number,
  ): Promise<any> {
    return this.locationsService.softDeleteLocation(req.user, id);
  }

  // ! Restore Location
  @Post('restore/:id')
  async restoreLocation(@Param('id') id: number): Promise<any> {
    return this.locationsService.restoreLocation(id);
  }

  // ! Hard Delete Location
  @Delete('hard-delete/:id')
  async hardDeleteLocation(
    @Request() req,
    @Param('id') id: number,
  ): Promise<any> {
    return this.locationsService.hardDeleteLocation(req.user, id);
  }
}
