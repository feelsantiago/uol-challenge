import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { Sex } from './types';

export class ClientDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsEnum(Sex)
    @IsNotEmpty()
    public sex: Sex;

    @IsNumber()
    @IsNotEmpty()
    public age: number;

    @IsDateString()
    public birthDate: Date;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    public city: ObjectId;
}
