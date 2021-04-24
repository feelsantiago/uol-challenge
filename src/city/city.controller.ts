import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MongoQueryValidationPipe } from '../shared/pipes/mongo-query-validation.pipe';
import { ObjectId } from '../shared/utils/object-id';
import { ObjectIdTransformPipe } from '../shared/pipes/object-id-transform.pipe';
import { CityQueryDto } from './city-query.dto';
import { CityDto } from './city.dto';
import { City } from './city.schema';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
    constructor(private readonly cityService: CityService) {}

    @Post()
    public async create(@Body() dto: CityDto): Promise<City> {
        return this.cityService.create(dto);
    }

    @Get(':id')
    public async getById(@Param('id', ObjectIdTransformPipe) id: ObjectId): Promise<City> {
        return this.cityService.findById(id);
    }

    @Get()
    public async get(@Query(MongoQueryValidationPipe) query: CityQueryDto): Promise<City[]> {
        console.log(query);
        return this.cityService.find(query);
    }
}
