import { IsOptional, IsString } from 'class-validator';

export class CityQueryDto {
    @IsString()
    @IsOptional()
    public name?: string;

    @IsString()
    @IsOptional()
    public state?: string;
}
