import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
    @IsOptional()
    @IsNumber()
    @Transform(v => Number(v))
    page?: number

    @IsOptional()
    @IsString()
    name?: string
}