import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CodeVerificationDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Поле id не должен быть пустым' })
    @IsNumber({}, { message: 'Поле id должен быть числом' })
    readonly id: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Поле code не должен быть пустым' })
    @IsNumber({}, { message: 'Поле code должен быть числом' })
    readonly code: number;
}