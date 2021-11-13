import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthUserLoginDto {

    @ApiProperty()
    @IsEmail({}, { message: 'Некорректный email' })
    @IsString({ message: 'email должен быть строкой' })
    @IsNotEmpty({ message: 'Поле email не должно быть пустым' })
    readonly email: string;

    @ApiProperty()
    @IsString({ message: 'Пароль должен быть строкой' })
    @MinLength(6, { message: 'Длина пароля должна быть не меньше 6 символов' })
    @IsNotEmpty({ message: 'Поле пароль не должно быть пустым' })
    readonly password: string;
}