import { IsNotEmpty, IsString } from 'class-validator';

export class ClientUpdateDto {
    @IsString()
    @IsNotEmpty()
    public name: string;
}
