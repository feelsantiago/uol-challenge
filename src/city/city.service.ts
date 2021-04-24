import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CityQueryDto } from './city-query.dto';
import { CityDto } from './city.dto';
import { City, CityDocument } from './city.schema';

@Injectable()
export class CityService {
    public get cities(): Model<CityDocument> {
        return this.cityModel;
    }

    constructor(@Inject(City.name) private readonly cityModel: Model<CityDocument>) {}

    public async create(city: CityDto): Promise<City> {
        return this.cities.create(city);
    }

    public async find(query: CityQueryDto): Promise<City[]> {
        return this.cities.find({ ...query }).exec();
    }

    public async findById(id: Types.ObjectId): Promise<City> {
        return this.cities.findById(id).exec();
    }
}
