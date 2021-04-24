import { Module } from '@nestjs/common';
import { AppConfigService } from './services/app-config.service';

@Module({
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class SharedModule {}
