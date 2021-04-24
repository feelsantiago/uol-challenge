import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isValidDate } from '../shared/utils/date-helper';
import { CityService } from '../city/city.service';
import { ClientDto } from './client.dto';
import { Client, ClientDocument } from './client.schema';

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
}
