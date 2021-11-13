import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class PasswordResetUserDto{
    @ApiProperty()
    @IsString()
    @MinLength(6, {message: "Длина пароля болжна быть больше 6"})
    password: string
}