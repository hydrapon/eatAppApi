import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { CheckUserAge } from '../../../utils/CustomValidate/age-validate.customValidate';

export class UpdateInfoUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString({ message: 'Имя должно быть строкой' })
    readonly name: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ message: 'Фамилия должна быть строкой' })
    readonly surname: string;

    @ApiProperty()
    @IsOptional()
    @CheckUserAge({
        message: 'Возраст пользователя должен быть больше 14 лет',
    })
    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, { message: 'Дата должна быть в формате гггг-мм-дд' })
    readonly birthday: Date;

    @ApiProperty()
    @IsOptional()
    @Matches(/data:image\/([a-zA-Z]*);base64,([^\"]*)/gm, { message: 'Неверный формат картинки' })
    @IsString({ message: 'Картинка должна быть строкой' })
    readonly avatar: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ message: 'Статус должен быть строкой' })
    readonly status: string;

    @ApiProperty()
    @IsOptional()
    @Min(0, { message: 'Параметр должен быть не меньше 0 и не больше 2' })
    @Max(2, { message: 'Параметр должен быть не меньше 0 и не больше 2' })
    @IsNumber({}, { message: 'Параметр должен быть числом' })
    readonly account_access: number
}