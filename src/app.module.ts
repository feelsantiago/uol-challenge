import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { ObjectIdTransformPipe } from './pipes/object-id-transform.pipe';
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
    ],
    controllers: [AppController],
    providers: [AppService, ObjectIdTransformPipe],
    exports: [ObjectIdTransformPipe],
})
export class AppModule {}
