import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envPath } from './shared/utils/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: envPath,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
