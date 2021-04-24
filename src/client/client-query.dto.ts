import { IsOptional, IsString } from 'class-validator';

export class ClientQueryDto {
    @IsString()
    @IsOptional()
    public name?: string;
}
