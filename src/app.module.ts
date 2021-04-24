import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CityModule } from './city/city.module';
import { ClientModule } from './client/client.module';
import { SharedModule } from './shared/shared.module';
import { envPath } from './shared/utils/config';
import { mongoConfig } from './shared/utils/mongo-config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: envPath,
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(mongoConfig),
        SharedModule,
        CityModule,
        ClientModule,
    ],
})
export class AppModule {}
