import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ObjectId } from '../shared/utils/object-id';
import { ClientUpdateDto } from './client-update.dto';
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

    @Put(':id')
    public async update(@Param('id') id: ObjectId, @Body() dto: ClientUpdateDto): Promise<Client> {
        return this.clientService.update(id, dto);
    }

    @Delete(':id')
    public async delete(@Param('id') id: ObjectId): Promise<Client> {
        return this.clientService.delete(id);
    }
}
