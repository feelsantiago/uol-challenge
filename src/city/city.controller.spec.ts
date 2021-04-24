import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MongoMemoryServerHandle } from '../shared/utils/mongo-memory-server-handler';
import { CityController } from './city.controller';
import { City, CitySchema } from './city.schema';
import { CityDto } from './dtos/city.dto';
import { CityService } from './city.service';

describe('CityController', () => {
    const mongoServerHandle = new MongoMemoryServerHandle();

    let mongooseConnection: Connection;
    let cityController: CityController;

    beforeAll(async () => {
        const uri = await mongoServerHandle.start();

        const app: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(uri),
                MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
            ],
            controllers: [CityController],
            providers: [CityService, ConfigService],
        }).compile();

        mongooseConnection = app.get<Connection>(getConnectionToken());
        cityController = app.get<CityController>(CityController);
    });

    beforeEach(async () => mongoServerHandle.clear(mongooseConnection));

    afterAll(async () => mongoServerHandle.disconnect());

    it('[CREATE] - Should create a new city in database', async () => {
        const city = new CityDto();
        city.name = 'Test Name';
        city.state = 'Test State';

        const result = await cityController.create(city);

        expect(result.name).toBe(city.name);
        expect(result.state).toBe(city.state);
        expect(result).toHaveProperty('_id');
    });
});
