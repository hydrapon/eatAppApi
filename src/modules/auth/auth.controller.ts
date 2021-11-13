import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTokensResponseDto } from './dto/auth-tokens.response.dto';
import { AuthUserLoginDto } from './dto/auth-user-login.dto';
import { AuthUserRegistrationDto } from './dto/auth-user-registration.dto';
import { Tokens } from '../../utils/enum/authTokens';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCreateResponseDto } from '../user/dto/user-create.response.dto';
import { VerificationLinkDto } from './dto/verification-link.auth.dto';
import { VerificationCodeDto } from './dto/verification-code.auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }


    @Post('/login')
    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiResponse({ type: AuthTokensResponseDto, status: 201 })
    async login(
        @Body() authUserLoginDto: AuthUserLoginDto,
        @Res() res,
    ): Promise<AuthTokensResponseDto> {
        const { accessToken, refreshToken } = await this.authService.login(authUserLoginDto)
        res.cookie(Tokens.REFRESH_TOKEN, refreshToken, {
            expires: new Date(new Date().getTime() + 30 * 1000),
            sameSite: 'strict',
            httpOnly: true,
        });
        return res.send({ accessToken });
    }

    @Post('/registration')
    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiResponse({ type: UserCreateResponseDto, status: 201 })
    async registration(@Body() authUserRegistrationDto: AuthUserRegistrationDto): Promise<UserCreateResponseDto> {
        return this.authService.registration(authUserRegistrationDto)
    }

    @Post('/refresh')
    @ApiOperation({ summary: 'Обновление токенов' })
    @ApiResponse({ type: AuthTokensResponseDto, status: 201 })
    async refresh(
        @Req() req,
        @Res() res,
    ): Promise<AuthTokensResponseDto> {
        const { accessToken, refreshToken } = await this.authService.refresh(req.headers.cookie)
        res.cookie(Tokens.REFRESH_TOKEN, refreshToken, {
            expires: new Date(new Date().getTime() + 30 * 1000),
            sameSite: 'strict',
            httpOnly: true,
        });
        return res.send({ accessToken });
    }

    @Get('/verification')
    @ApiOperation({ summary: 'Подтверждение аккаунта с помощью ссылки' })
    async verificationFromLink(
        @Query() verificationLinkDto: VerificationLinkDto
    ): Promise<'OK'> {
        return this.authService.verification(verificationLinkDto, 'link')
    }

    @Post('/verification')
    @ApiOperation({ summary: 'Подтверждение аккаунта с помощью UI' })
    async verificationFromUI(
        @Body() verificationData: VerificationCodeDto
    ): Promise<'OK'> {
        return this.authService.verification(verificationData, 'code')
    }
}
