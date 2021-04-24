import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './city.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: City.name, schema: CitySchema }])],
})
export class CityModule {}
