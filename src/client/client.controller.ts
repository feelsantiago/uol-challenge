import { Body, Controller, Post } from '@nestjs/common';
import { ClientDto } from './client.dto';
import { Client } from './client.schema';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Post()
    public async create(@Body() dto: ClientDto): Promise<Client> {
        return this.clientService.create(dto);
    }
}
