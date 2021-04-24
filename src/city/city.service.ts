import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from '../shared/utils/object-id';
import { CityQueryDto } from './dtos/city-query.dto';
import { CityDto } from './dtos/city.dto';
import { City, CityDocument } from './city.schema';

@Injectable()
export class CityService {
    public get cities(): Model<CityDocument> {
        return this.cityModel;
    }

    constructor(@InjectModel(City.name) private readonly cityModel: Model<CityDocument>) {}

    public async create(city: CityDto): Promise<City> {
        return this.cities.create(city);
    }

    public async find(query: CityQueryDto): Promise<City[]> {
        return this.cities.find({ ...query }).exec();
    }

    public async findById(id: ObjectId): Promise<City> {
        return this.cities.findById(id).exec();
    }
}
