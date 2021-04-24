import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from '../shared/utils/object-id';
import { isValidDate } from '../shared/utils/date-helper';
import { CityService } from '../city/city.service';
import { ClientDto } from './dtos/client.dto';
import { Client, ClientDocument } from './client.schema';
import { ClientUpdateDto } from './dtos/client-update.dto';
import { ClientQueryDto } from './dtos/client-query.dto';

@Injectable()
export class ClientService {
    public get clients(): Model<ClientDocument> {
        return this.clientModel;
    }

    constructor(
        @InjectModel(Client.name) private readonly clientModel: Model<ClientDocument>,
        private readonly cityService: CityService,
    ) {}

    public async create(dto: ClientDto): Promise<Client> {
        const { name, sex, age, birthDate: date, city: cityId } = dto;
        const city = await this.cityService.findById(cityId);

        if (!city) {
            throw new BadRequestException('Invalid City!');
        }

        const birthDate = new Date(date);

        if (!isValidDate(birthDate)) {
            throw new BadRequestException('Invalid Date');
        }

        return this.clients.create({ name, sex, age, birthDate, city });
    }

    public async update(id: ObjectId, dto: ClientUpdateDto): Promise<Client> {
        return this.clients.findByIdAndUpdate(id, { $set: { ...dto } }, { new: true }).exec();
    }

    public async delete(id: ObjectId): Promise<Client> {
        return this.clients.findByIdAndRemove(id).exec();
    }

    public async find(query: ClientQueryDto): Promise<Client[]> {
        return this.clients.find({ ...query }).exec();
    }

    public async findById(id: ObjectId): Promise<Client> {
        return this.clients.findById(id).exec();
    }
}
