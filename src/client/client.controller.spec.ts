import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { City, CitySchema } from '../city/city.schema';
import { CityService } from '../city/city.service';
import { MongoMemoryServerHandle } from '../shared/utils/mongo-memory-server-handler';
import { Client, ClientSchema } from './client.schema';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { Sex } from './types';

describe('ClientController', () => {
    const mongoServerHandle = new MongoMemoryServerHandle();

    let mongooseConnection: Connection;
    let clientController: ClientController;
    let cityService: CityService;

    beforeAll(async () => {
        const uri = await mongoServerHandle.start();

        const app: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(uri),
                MongooseModule.forFeature([
                    { name: Client.name, schema: ClientSchema },
                    { name: City.name, schema: CitySchema },
                ]),
            ],
            controllers: [ClientController],
            providers: [ClientService, CityService],
        }).compile();

        mongooseConnection = app.get<Connection>(getConnectionToken());
        clientController = app.get<ClientController>(ClientController);
        cityService = app.get<CityService>(CityService);
    });

    beforeEach(async () => mongoServerHandle.clear(mongooseConnection));

    afterAll(async () => {
        await mongooseConnection.close();
        await mongoServerHandle.disconnect();
    });

    describe('Write Operations', () => {
        it('[Create] - Should create a new client in database', async () => {
            const id = new Types.ObjectId();
            const cityMock = {
                _id: id,
                id: id.toHexString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Test City',
                state: 'Test City',
            };
            jest.spyOn(cityService, 'findById').mockImplementation(() => Promise.resolve(cityMock));

            const client = { name: 'Test Client', sex: Sex.masculine, age: 20, birthDate: '1995-07-17', city: id };
            const result = await clientController.create(client);

            expect(result.name).toBe(client.name);
            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('createdAt');
            expect(result).toHaveProperty('updatedAt');
        });

        it('[Create] - Should throw error for invalid city', async () => {
            let city: City;
            jest.spyOn(cityService, 'findById').mockImplementation(() => Promise.resolve(city));

            const client = {
                name: 'Test Client',
                sex: Sex.masculine,
                age: 20,
                birthDate: '1995-07-17',
                city: new Types.ObjectId(),
            };

            await expect(async () => clientController.create(client)).rejects.toThrow('Invalid City!');
        });

        it('[Update] - Should update the name for a client', async () => {
            const id = new Types.ObjectId();
            const cityMock = {
                _id: id,
                id: id.toHexString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Test City',
                state: 'Test City',
            };
            jest.spyOn(cityService, 'findById').mockImplementation(() => Promise.resolve(cityMock));

            const client = { name: 'Test Client', sex: Sex.masculine, age: 20, birthDate: '1995-07-17', city: id };
            const created = await clientController.create(client);

            const updateDto = { name: 'Test Client Updated' };
            const updated = await clientController.update(created._id, updateDto);

            expect(updated._id.toHexString()).toStrictEqual(created._id.toHexString());
            expect(updated.name).toBe(updateDto.name);
        });

        it('[Delete] - Should remove a client', async () => {
            const id = new Types.ObjectId();
            const cityMock = {
                _id: id,
                id: id.toHexString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Test City',
                state: 'Test City',
            };
            jest.spyOn(cityService, 'findById').mockImplementation(() => Promise.resolve(cityMock));

            const client = { name: 'Test Client', sex: Sex.masculine, age: 20, birthDate: '1995-07-17', city: id };
            const created = await clientController.create(client);

            const removed = await clientController.delete(created._id);
            const clients = await clientController.get({});

            expect(removed._id.toHexString()).toStrictEqual(created._id.toHexString());
            expect(clients.length).toBe(0);
        });
    });

    describe('Read Operations', () => {
        it('[GetById] - Should find a client by id', async () => {
            const id = new Types.ObjectId();
            const cityMock = {
                _id: id,
                id: id.toHexString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Test City',
                state: 'Test City',
            };
            jest.spyOn(cityService, 'findById').mockImplementation(() => Promise.resolve(cityMock));

            const client = { name: 'Test Client', sex: Sex.masculine, age: 20, birthDate: '1995-07-17', city: id };
            const created = await clientController.create(client);
            const result = await clientController.getById(created._id);

            expect(result).toBeDefined();
            expect(result._id.toHexString()).toStrictEqual(created._id.toHexString());
            expect(result.name).toBe(client.name);
        });

        it('[GetById] - Should return null when not find a valid client', async () => {
            const result = await clientController.getById(new Types.ObjectId());

            expect(result).toBeNull();
        });

        it('[Get] - Should find a client by name', async () => {
            const id = new Types.ObjectId();
            const cityMock = {
                _id: id,
                id: id.toHexString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'Test City',
                state: 'Test City',
            };
            jest.spyOn(cityService, 'findById').mockImplementation(() => Promise.resolve(cityMock));

            const client = { name: 'Test Client', sex: Sex.masculine, age: 20, birthDate: '1995-07-17', city: id };
            const created = await clientController.create(client);
            const result = await clientController.get({ name: 'Test Client' });

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(result[0].name).toBe(created.name);
        });

        it("[Get] - Should return a empty array when find don't match", async () => {
            const result = await clientController.get({ name: 'Test' });

            expect(result).toBeDefined();
            expect(result.length).toBe(0);
        });
    });
});
