import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";
import { UserAuthDto } from './dto/user.auth.dto';
import { RegistrationUserDto } from './dto/registration.auth.dto';
import { NewUserDto } from '../users/dto/new.user.dto';
import { JwtService } from '@nestjs/jwt';
import { TokensAuthResponseDto } from './dto/tokens.auth.dto';
import { UserAuthRefresh } from './dto/use-refresh.auth.dto';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { UsersEntity } from 'src/database/models/users.entity';
import { MailerService } from "@nestjs-modules/mailer";
import { contactsOptions } from "../../common/options/contact.option";
import { ApprovedDataDto } from './dto/approved-data.auth.dto';
import { GenerateString } from 'src/common/services/string-generator.service';
import { GenerateCode } from 'src/common/services/code-generator.service';

@Injectable()
export class AuthService {
  private PASSWORD_SALT_ROUNDS = 10;
  private PASS_RESET_HASH_LENGTH_BYTES = 16;

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  async validateAuthUser(email: string, password: string): Promise<UserAuthDto | null> {
    const user = await this.userService.findByOneEmail(email);

    if (!user) { return null; }
    if (user.status === UserStatus.DELETED) { return null; }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) { return null; }

    return new UserAuthDto(user)
  }

  async registration(regUserDto: RegistrationUserDto): Promise<"ok"> {
    const user = await this.userService.findByOneEmail(regUserDto.email);

    if (user) {
      throw new HttpException("Пользователь с таким email уже существует", HttpStatus.CONFLICT)
    }

    const passHash = await bcrypt.hash(regUserDto.password, this.PASSWORD_SALT_ROUNDS);

    try {
      const approvedData: ApprovedDataDto = {
        approvedHash: await GenerateString.generateStringByRandomBytes(this.PASS_RESET_HASH_LENGTH_BYTES),
        approvedCode: await GenerateCode.generateCodeSixNums()
      }
      await this.userService.addUser(new NewUserDto(passHash, regUserDto), approvedData);
      await this.mailerService
        .sendMail({
          to: regUserDto.email,
          from: contactsOptions.mail,
          subject: "Подтверждение регистрации",
          text: `Введите код подтверждения "${approvedData.approvedCode}" или перейдите по ссылке: 192.168.1.250:3431/auth/approved?token=${approvedData.approvedHash}`
          // html: getTemplatePasswordReset(token),
        })
        .catch(() => {
          throw new HttpException("Ошибка отправки email", HttpStatus.INTERNAL_SERVER_ERROR);
        });

      return "ok"
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async login(user: UserAuthDto): Promise<TokensAuthResponseDto> {
    return await this.generateToken(user)
  }

  async refresh(refreshToken: string | undefined) {
    if (refreshToken && typeof refreshToken === 'string') {
      try {
        const payload: UserAuthRefresh = this.jwtService.verify(refreshToken);
        if (!payload.refresh) {
          throw new UnauthorizedException({ message: 'Невалидный токен' });
        }
        if (payload.status === UserStatus.DELETED) {
          throw new UnauthorizedException({ message: 'Пользователь удален' });
        }
        if (payload.status === UserStatus.UNAPPROVED) {
          throw new UnauthorizedException({ message: 'Пользователь не подтвержден' });
        }
        const user = await this.userService.findOneById(payload.id);
        if (!user) {
          throw new UnauthorizedException({ message: 'Невалидный токен' });
        }
        return await this.generateToken(user);
      } catch {
        throw new UnauthorizedException({ message: 'Невалидный токен' });
      }
    }
    throw new UnauthorizedException({ message: 'Невалидный токен' });
  }

  private async generateToken(user: UsersEntity | UserAuthDto): Promise<TokensAuthResponseDto> {
    const payloadAccess = { id: user.id, status: user.status };
    const payloadARefresh = { id: user.id, status: user.status, refresh: true }
    return {
      accessToken: this.jwtService.sign(payloadAccess, { expiresIn: 60 * 60 }),
      refreshToken: this.jwtService.sign(payloadARefresh, { expiresIn: 60 * 60 * 24 * 3 })
    }
  }

}
