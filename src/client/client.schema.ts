import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { City, CitySchema } from '../city/city.schema';
import { Entity } from '../shared/utils/entity';
import { Sex } from './types';

@Schema({ timestamps: true })
export class Client extends Entity {
    @Prop({ required: true })
    public name: string;

    @Prop({ type: Sex, enum: [Sex.masculine, Sex.feminine], required: true })
    public sex: Sex;

    @Prop({ required: true })
    public age: number;

    @Prop({ required: true })
    public birthDate: Date;

    @Prop({ type: CitySchema })
    public city: City;
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);
