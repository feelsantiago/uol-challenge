import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Client } from '../src/client/client.schema';
import { City } from '../src/city/city.schema';
import { envPath } from '../src/shared/utils/config';
import { MongoMemoryServerHandle } from '../src/shared/utils/mongo-memory-server-handler';
import { CityModule } from '../src/city/city.module';
import { ClientModule } from '../src/client/client.module';
import { SharedModule } from '../src/shared/shared.module';

describe('ClientController (e2e)', () => {
    const mongoServerHandle = new MongoMemoryServerHandle();

    let app: INestApplication;
    let mongooseConnection: Connection;

    beforeAll(async () => {
        const uri = await mongoServerHandle.start();

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    envFilePath: envPath,
                    isGlobal: true,
                }),
                MongooseModule.forRoot(uri),
                SharedModule,
                CityModule,
                ClientModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                forbidUnknownValues: true,
                validationError: { target: false, value: true },
                transformOptions: { enableImplicitConversion: true },
            }),
        );

        mongooseConnection = app.get<Connection>(getConnectionToken());

        await app.init();
    });

    beforeEach(async () => mongoServerHandle.clear(mongooseConnection));

    afterAll(async () => {
        await mongooseConnection.close();
        await mongoServerHandle.disconnect();
    });

    it('/ (POST) - Create new client', async () => {
        const cityDto = { name: 'Test City', state: 'Test State' };
        const resCity = await request(app.getHttpServer()).post('/city').send(cityDto);

        const city = resCity.body as City;

        const dto = { name: 'Client Test', age: 20, sex: 'm', birthDate: '1995-07-17', city: city._id };
        const res = await request(app.getHttpServer()).post('/client').send(dto);
        const body = res.body as Client;

        expect(res.status).toBe(201);
        expect(body).toBeDefined();
        expect(body).toHaveProperty('_id');
        expect(body.name).toBe(dto.name);
    });

    it('/ (PUT) - Update client name', async () => {
        const cityDto = { name: 'Test City', state: 'Test State' };
        const resCity = await request(app.getHttpServer()).post('/city').send(cityDto);

        const city = resCity.body as City;

        const dto = { name: 'Client Test', age: 20, sex: 'm', birthDate: '1995-07-17', city: city._id };
        const clientRes = await request(app.getHttpServer()).post('/client').send(dto);
        const client = clientRes.body as Client;
        const id = client._id as unknown;

        const updateDto = { name: 'Client Test Updated ' };
        const res = await request(app.getHttpServer())
            .put(`/client/${id as string}`)
            .send(updateDto);
        const body = res.body as Client;

        expect(res.status).toBe(200);
        expect(body).toBeDefined();
        expect(body.id).toStrictEqual(client.id);
        expect(body.name).toBe(updateDto.name);
        expect(body.name).not.toBe(client.name);
    });

    it('/ (DELETE) - Delete Client', async () => {
        const cityDto = { name: 'Test City', state: 'Test State' };
        const resCity = await request(app.getHttpServer()).post('/city').send(cityDto);

        const city = resCity.body as City;

        const dto = { name: 'Client Test', age: 20, sex: 'm', birthDate: '1995-07-17', city: city._id };
        const clientRes = await request(app.getHttpServer()).post('/client').send(dto);
        const client = clientRes.body as Client;
        const id = client._id as unknown;

        const res = await request(app.getHttpServer())
            .delete(`/client/${id as string}`)
            .send();
        const body = res.body as Client;

        const findRes = await request(app.getHttpServer()).get('/client').send();
        const findBody = findRes.body as Client[];

        expect(res.status).toBe(200);
        expect(body).toBeDefined();
        expect(body.id).toStrictEqual(client.id);
        expect(body.name).toBe(client.name);
        expect(findBody).toBeDefined();
        expect(Array.isArray(findBody)).toBe(true);
        expect(findBody.length).toBe(0);
    });

    it('/ (GET) - Should find a client by name', async () => {
        const cityDto = { name: 'Test City', state: 'Test State' };
        const resCity = await request(app.getHttpServer()).post('/city').send(cityDto);

        const city = resCity.body as City;

        const dto = { name: 'Client Test', age: 20, sex: 'm', birthDate: '1995-07-17', city: city._id };
        const createRes = await request(app.getHttpServer()).post('/client').send(dto);
        const client = createRes.body as Client;

        const res = await request(app.getHttpServer()).get('/client?name=Client').send();
        const body = res.body as Client[];

        expect(res.status).toBe(200);
        expect(body).toBeDefined();
        expect(body.length).toBe(1);
        expect(body[0].name).toBe(client.name);
    });

    it('/ (GET) - Should find a client by id', async () => {
        const cityDto = { name: 'Test City', state: 'Test State' };
        const resCity = await request(app.getHttpServer()).post('/city').send(cityDto);

        const city = resCity.body as City;

        const dto = { name: 'Client Test', age: 20, sex: 'm', birthDate: '1995-07-17', city: city._id };
        const createRes = await request(app.getHttpServer()).post('/client').send(dto);
        const client = createRes.body as Client;
        const id = client._id as unknown;

        const res = await request(app.getHttpServer())
            .get(`/client/${id as string}`)
            .send();
        const body = res.body as Client;

        expect(res.status).toBe(200);
        expect(body).toBeDefined();
        expect(body.name).toBe(client.name);
    });
});
