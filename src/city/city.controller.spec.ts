import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
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

    afterAll(async () => {
        await mongooseConnection.close();
        await mongoServerHandle.disconnect();
    });

    describe('Write Operations', () => {
        it('[Create] - Should create a new city in database', async () => {
            const city = new CityDto();
            city.name = 'Test Name';
            city.state = 'Test State';

            const result = await cityController.create(city);

            expect(result.name).toBe(city.name);
            expect(result.state).toBe(city.state);
            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('updatedAt');
        });
    });

    describe('Read Operations', () => {
        it('[GetById] - Should find a city by id', async () => {
            const mock = { name: 'Test City', state: 'Test State ' };
            const city = await cityController.create(mock);
            const result = await cityController.getById(city._id);

            expect(result).toBeDefined();
            expect(result._id.toHexString()).toStrictEqual(city._id.toHexString());
            expect(result.name).toBe(mock.name);
        });

        it('[GetById] - Should return null when not find a valid city', async () => {
            const result = await cityController.getById(new Types.ObjectId());

            expect(result).toBeNull();
        });

        it('[Get] - Should find a city by name', async () => {
            const mock = { name: 'Test City', state: 'Test State' };
            const city = await cityController.create(mock);
            const result = await cityController.get({ name: 'Test City' });

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0].name).toBe(city.name);
        });

        it('[Get] - Should find a city by state', async () => {
            const mock = { name: 'Test City', state: 'Test State' };
            const city = await cityController.create(mock);
            const result = await cityController.get({ state: 'Test State' });

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0].state).toBe(city.state);
        });

        it("[Get] - Should return a empty array when find don't match", async () => {
            const result = await cityController.get({ name: 'Test' });
            const result2 = await cityController.get({ state: 'Test State' });

            expect(result).toBeDefined();
            expect(result2).toBeDefined();
            expect(result.length).toBe(0);
            expect(result2.length).toBe(0);
        });
    });
});
