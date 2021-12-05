import { Strategy } from "passport-local";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "../auth.service";
import { UserAuthDto } from '../dto/user.auth.dto';
import { UserStatus } from 'src/common/enums/user-status.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email'
    });
  }

  public async validate(email: string, password: string): Promise<UserAuthDto> {
    const user = await this.authService.validateAuthUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Логин или пароль указаны неверно");
    }

    if (user.status == UserStatus.UNAPPROVED) {
      throw new UnauthorizedException("Аккаунт не подтвержден");
    }

    if (user.status == UserStatus.DELETED) {
      throw new UnauthorizedException("Аккаунт удален");
    }

    return user;
  }
}