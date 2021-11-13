import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken?: string;
}