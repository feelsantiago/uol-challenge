import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientDto } from './client.dto';
import { Client, ClientDocument } from './client.schema';

@Injectable()
export class ClientService {
    public get clients(): Model<ClientDocument> {
        return this.clientModel;
    }

    constructor(@InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>) {}

    public async create(dto: ClientDto): Promise<Client> {
        return this.clients.create(dto);
    }
}
