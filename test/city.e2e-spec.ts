import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { City } from '../src/city/city.schema';
import { envPath } from '../src/shared/utils/config';
import { MongoMemoryServerHandle } from '../src/shared/utils/mongo-memory-server-handler';
import { CityModule } from '../src/city/city.module';
import { ClientModule } from '../src/client/client.module';
import { SharedModule } from '../src/shared/shared.module';

describe('CityController (e2e)', () => {
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

    it('/ (POST) - Create new city', async () => {
        const dto = { name: 'Test City', state: 'Test State' };
        const res = await request(app.getHttpServer()).post('/city').send(dto);

        const body = res.body as City;

        expect(res.status).toBe(201);
        expect(body).toBeDefined();
        expect(body).toHaveProperty('_id');
        expect(body.name).toBe(dto.name);
    });

    it('/ (GET) - Should find a city by name', async () => {
        const dto = { name: 'Test City', state: 'Test State' };
        await request(app.getHttpServer()).post('/city').send(dto);

        const res = await request(app.getHttpServer()).get('/city?name=Test').send();

        const body = res.body as City[];

        expect(res.status).toBe(200);
        expect(body).toBeDefined();
        expect(body.length).toBe(1);
        expect(body[0].name).toBe(dto.name);
    });

    it('/ (GET) - Should find a city by state', async () => {
        const dto = { name: 'Test City', state: 'Test State' };
        await request(app.getHttpServer()).post('/city').send(dto);

        const res = await request(app.getHttpServer()).get('/city?state=Test').send();

        const body = res.body as City[];

        expect(res.status).toBe(200);
        expect(body).toBeDefined();
        expect(body.length).toBe(1);
        expect(body[0].state).toBe(dto.state);
    });
});
