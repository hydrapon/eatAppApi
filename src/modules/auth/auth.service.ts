import { Inject, Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { UserDto } from '../user/dto/user.dto';
import { USERS_REPOSITORY } from 'src/utils/keys';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthUserLoginDto } from './dto/auth-user-login.dto';
import { AuthUserRegistrationDto } from './dto/auth-user-registration.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'
import { AuthTokensResponseDto } from './dto/auth-tokens.response.dto';
import { Tokens } from '../../utils/enum/authTokens';
import { UserCreateResponseDto } from '../user/dto/user-create.response.dto';
import { AccountStatusUserEnum } from 'src/utils/enum/accountStatusUser';
import { HttpService } from '@nestjs/axios';
import { VerificationUserDto } from './dto/verification.auth.dto';

@Injectable()
export class AuthService {

    constructor(
        @Inject(USERS_REPOSITORY)
        private readonly usersRepository: typeof User,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly axiosService: HttpService
    ) { }

    async login(authUserLoginDto: AuthUserLoginDto): Promise<AuthTokensResponseDto> {
        const user = await this.validateUser(authUserLoginDto);
        return this.generateToken(user)
    }

    async registration(authUserRegistrationDto: AuthUserRegistrationDto): Promise<UserCreateResponseDto> {
        const hash = this.generateHash();
        const code = this.getAcceseCode();
        const user = await this.userService.createUser(authUserRegistrationDto, hash, code)
        this.sendMail({
            email: user.email,
            hash, code
        })
        return new UserCreateResponseDto(user)
    }

    async refresh(cookie: string): Promise<AuthTokensResponseDto> {
        const refreshToken = this.searchRefreshToken(cookie);
        if (refreshToken && typeof refreshToken === 'string') {
            try {
                const payload = this.jwtService.verify(refreshToken)
                if (payload.refresh && payload.id) {
                    const user = await this.usersRepository.findByPk(payload.id)
                    if (user.accountStatus === AccountStatusUserEnum.UNAPPROVED) {
                        throw new HttpException('Аккаунт не подтвержден', HttpStatus.FORBIDDEN)
                    }
                    if (user.accountStatus === AccountStatusUserEnum.BANNED) {
                        throw new HttpException('Аккаунт заблокирован', HttpStatus.FORBIDDEN)
                    }

                    if (!user) {
                        throw new HttpException(
                            'Пользователь не найден',
                            HttpStatus.NOT_FOUND,
                        );
                    }
                    return this.generateToken(new UserDto(user))

                }
                throw new UnauthorizedException({ message: 'Невалидный токен' })
            } catch {
                throw new UnauthorizedException({ message: 'Невалидный токен' })
            }

        }
    }

    async sendMail(mailData) {
        await this.axiosService.post('http://192.168.1.250:1122/sendMail', { mail: mailData.email, code: mailData.code, hash: mailData.hash }).subscribe()
    }

    async validateUser(authUserLoginDto: AuthUserLoginDto): Promise<UserDto> {
        const user = await this.usersRepository.findOne({ where: { email: authUserLoginDto.email } })
        if (!user) {
            throw new HttpException(
                'Пользователь с таким email не найден',
                HttpStatus.NOT_FOUND,
            );
        }
        if (user.accountStatus === AccountStatusUserEnum.UNAPPROVED) {
            throw new HttpException('Аккаунт не подтвержден', HttpStatus.FORBIDDEN)
        }
        if (user.accountStatus === AccountStatusUserEnum.BANNED) {
            throw new HttpException('Аккаунт заблокирован', HttpStatus.FORBIDDEN)
        }

        const checkPassword = await bcrypt.compare(authUserLoginDto.password, user.password)
        if (checkPassword) {
            return new UserDto(user)
        }
        throw new HttpException(
            'Неверный пароль',
            HttpStatus.NOT_FOUND,
        );

    }

    async verification(verifyData: VerificationUserDto, action: 'code' | 'link'): Promise<'OK'> {
        let user: User;
        if (action === 'code') {
            user = await this.usersRepository.findByPk(verifyData.id);
            if (!user) {
                throw new HttpException(
                    'Пользователь с таким email не найден',
                    HttpStatus.NOT_FOUND,
                );
            }
            if (user.approvedCode !== verifyData.code) {
                throw new HttpException(
                    'Неверный проверочный код',
                    HttpStatus.CONFLICT,
                );
            }

        }
        if (action === 'link') {
            user = await this.usersRepository.findOne({ where: { email: verifyData.from } })
            if (!user) {
                throw new HttpException(
                    'Пользователь с таким email не найден',
                    HttpStatus.NOT_FOUND,
                );
            }
            if (user.approvedHash !== verifyData.hash) {
                throw new HttpException(
                    'Неверный проверочный код',
                    HttpStatus.CONFLICT,
                );
            }
        }

        user.approvedCode = null;
        user.approvedHash = null;
        user.accountStatus = AccountStatusUserEnum.APPROVED;
        user.save()
        return 'OK'
    }

    private generateHash() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 20);
    }

    private getAcceseCode() {
        const min = Math.ceil(100000);
        const max = Math.floor(999999);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private async generateToken(user: UserDto): Promise<AuthTokensResponseDto> {
        const payloadAccess = { id: user.id };
        const payloadARefresh = { id: user.id, refresh: true }
        return {
            accessToken: this.jwtService.sign(payloadAccess, { expiresIn: 60 * 60 }),
            refreshToken: this.jwtService.sign(payloadARefresh, { expiresIn: 60 * 60 * 24 * 3 })
        }
    }

    private searchRefreshToken = (cookie: string): boolean | string => {
        const arrCookie = cookie.split(';');
        for (let lineCookie of arrCookie) {
            const arrLineCookie = lineCookie.trim().split('=');
            if (arrLineCookie[0].trim() === Tokens.REFRESH_TOKEN) return arrLineCookie[1].trim();
        }
        return false;
    }
}
