import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Entity } from '../shared/utils/entity';

@Schema({ timestamps: true })
export class City extends Entity {
    @Prop({ required: true })
    public name: string;

    @Prop({ required: true })
    public state: string;
}

export type CityDocument = City & Document;
export const CitySchema = SchemaFactory.createForClass(City);
