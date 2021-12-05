import { Body, Controller, Post, UseGuards, Request, Res, HttpStatus, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiCookieAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ExceptionDto } from 'src/common/dto/exception.dto';
import { Tokens } from 'src/common/enums/tokens.enum';
import { UserAuthRequest } from 'src/common/interfaces/user-auth-request.interface';
import { AuthService } from './auth.service';
import { ApprovedUserRequestDto } from './dto/approved-user-request.auth.dto';
import { LoginResponseBodyDto } from './dto/login-response-body.auth.dto';
import { LoginAuthDto } from './dto/login.auth.dto';
import { RegistrationUserDto } from './dto/registration.auth.dto';

@ApiTags("Аутентификация пользователей")
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }



  @ApiOperation({ summary: "Аутентификация пользователя" })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseBodyDto, headers: { 'cookie': { description: `{${Tokens.REFRESH_TOKEN}=string}` } } })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ExceptionDto })
  @Post('login')
  @ApiBody({ type: LoginAuthDto })
  @UseGuards(AuthGuard("local"))
  async login(
    @Request() req: UserAuthRequest,
    @Res() res,
  ): Promise<LoginResponseBodyDto> {
    const { accessToken, refreshToken } = await this.authService.login(req.user)
    res.cookie(Tokens.REFRESH_TOKEN, refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
    });
    return res.send({ accessToken });
  }

  @ApiOperation({ summary: "Регистрация пользователя" })
  @ApiResponse({ status: HttpStatus.CREATED, type: String, description: "ok" })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ExceptionDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ExceptionDto })
  @Post('registration')
  registration(
    @Body() regUserDto: RegistrationUserDto
  ): Promise<"ok"> {
    return this.authService.registration(regUserDto);
  }

  @ApiOperation({ summary: "Обновление токена пользователя" })
  @ApiHeader({ name: "cookie", description: Tokens.REFRESH_TOKEN })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseBodyDto, headers: { 'cookie': { description: `{${Tokens.REFRESH_TOKEN}=string}` } } })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ExceptionDto })
  @Post('refresh')
  async refresh(
    @Req() req,
    @Res() res,
  ): Promise<LoginResponseBodyDto> {
    const { accessToken, refreshToken } = await this.authService.refresh(req.cookies[Tokens.REFRESH_TOKEN]);
    res.cookie(Tokens.REFRESH_TOKEN, refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
    });
    return res.send({ accessToken });
  }

  @ApiOperation({ summary: "Подтверждение регистрации пользователя" })
  @ApiResponse({ status: HttpStatus.CREATED, type: String, description: "ok" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ExceptionDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ExceptionDto })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, type: ExceptionDto })
  @Post('approved')
  approved(
    @Body() approvedUserRequestDto: ApprovedUserRequestDto
  ) {
    return this.authService.approved(approvedUserRequestDto)
  }
}
