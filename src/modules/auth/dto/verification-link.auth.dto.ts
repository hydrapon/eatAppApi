import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerificationLinkDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly from: string;

    @IsString()
    @IsNotEmpty()
    readonly hash: string;
}