import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    public get databaseUrl(): string {
        return this.configService.get<string>('DATBASE_URL');
    }

    public get port(): number {
        const port = this.configService.get<string>('PORT');
        return Number.isNaN(port) ? 3000 : Number(port);
    }
}
