import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { AppConfigService } from '../services/app-config.service';
import { SharedModule } from '../shared.module';

export const mongoConfig: MongooseModuleAsyncOptions = {
    imports: [SharedModule],
    useFactory: (appConfigService: AppConfigService) => ({
        uri: appConfigService.databaseUrl,
    }),
    inject: [AppConfigService],
};
