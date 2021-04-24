import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../shared/shared.module';
import { ClientController } from './client.controller';
import { Client, ClientSchema } from './client.schema';
import { ClientService } from './client.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]), SharedModule],
    controllers: [ClientController],
    providers: [ClientService],
    exports: [ClientService],
})
export class ClientModule {}
