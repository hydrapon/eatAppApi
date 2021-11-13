import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { CheckUserAge } from '../../../utils/CustomValidate/age-validate.customValidate';



export class AuthUserRegistrationDto {

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

    @ApiProperty()
    @IsString({ message: 'Имя должно быть строкой' })
    @IsNotEmpty({ message: 'Поле имя не должно быть пустым' })
    readonly name: string;

    @ApiProperty()
    @IsString({ message: 'Фамилия должна быть строкой' })
    @IsNotEmpty({ message: 'Поле фамилия не должно быть пустым' })
    readonly surname: string;

    @ApiProperty()
    @CheckUserAge({
        message: 'Возраст пользователя должен быть больше 14 лет',
    })
    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
        message: 'Дата должна быть в формате гггг-мм-дд',
    })
    @IsNotEmpty({ message: 'Поле дата рождения не должно быть пустым' })
    readonly birthday: Date;

}