import { IsNotEmpty, IsString } from 'class-validator';

export class CityDto {
    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsString()
    @IsNotEmpty()
    public state: string;
}
