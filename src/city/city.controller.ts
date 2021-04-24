import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { ObjectIdTransformPipe } from '../pipes/object-id-transform.pipe';
import { CityQueryDto } from './city-query.dto';
import { CityDto } from './city.dto';
import { City } from './city.schema';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
    constructor(private readonly cityService: CityService) {}

    @Post()
    public async create(dto: CityDto): Promise<City> {
        return this.cityService.create(dto);
    }

    @Get()
    public async get(@Query() query: CityQueryDto): Promise<City[]> {
        return this.cityService.find(query);
    }

    @Get(':id')
    public async getById(@Param('id', ObjectIdTransformPipe) id: Types.ObjectId): Promise<City> {
        return this.cityService.findById(id);
    }
}
