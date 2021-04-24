import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MongoQueryValidationPipe } from '../shared/pipes/mongo-query-validation.pipe';
import { ObjectId } from '../shared/utils/object-id';
import { ClientQueryDto } from './dtos/client-query.dto';
import { ClientUpdateDto } from './dtos/client-update.dto';
import { ClientDto } from './dtos/client.dto';
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

    @Get(':id')
    public async getById(@Param('id') id: ObjectId): Promise<Client> {
        return this.clientService.findById(id);
    }

    @Get()
    public async get(@Query(MongoQueryValidationPipe) query: ClientQueryDto): Promise<Client[]> {
        return this.clientService.find(query);
    }
}
