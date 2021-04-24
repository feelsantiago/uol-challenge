import { Type } from 'class-transformer';
import { IsEnum, IsISO8601, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ObjectId } from '../shared/utils/object-id';
import { Sex } from './types';

export class ClientDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsEnum(Sex, { message: `sex must be [${Sex.masculine}, ${Sex.feminine}]` })
    @IsNotEmpty()
    public sex: Sex;

    @IsNumber()
    @IsNotEmpty()
    public age: number;

    @IsISO8601()
    public birthDate: string;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    public city: ObjectId;
}
