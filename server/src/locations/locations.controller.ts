import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationEntity } from './entities/location.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateLocationDto } from './dto/create-location.dto';
import { FilterDto } from 'helper/dto/Filter.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@UseGuards(AuthGuard)
@Controller('location')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}
  // ? Create a new location
  @Post('create')
  async createLocation(
    @Body() location: CreateLocationDto,
  ): Promise<LocationEntity | any> {
    return this.locationsService.createLocation(location);
  }
  // ? Get all locations
  @Get('get-all')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllLocations(@Query() query: FilterDto): Promise<any> {
    return this.locationsService.getAllLocations(query);
  }
}
