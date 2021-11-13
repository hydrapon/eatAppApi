import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {

    @ApiProperty()
    @IsEmail()
    @IsString()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @ApiProperty()
    @IsString()
    readonly name: string;

    @ApiProperty()
    @IsString()
    readonly surname: string;

    @ApiProperty()
    @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i)
    readonly birthday: Date;
}