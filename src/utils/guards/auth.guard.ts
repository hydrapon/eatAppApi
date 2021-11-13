import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { User } from 'src/modules/user/user.entity';
import { AccountStatusUserEnum } from '../enum/accountStatusUser';
import { USERS_REPOSITORY } from '../keys';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(USERS_REPOSITORY)
        private readonly userRepo: typeof User
    ) { }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const authHeaderArray = authHeader.split(' ');
            const bearer = authHeaderArray[0];
            const token = authHeaderArray[1];

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({ message: 'Невалидный токен' })
            }

            const user = this.jwtService.verify(token);
            const getUser = await this.userRepo.findByPk(user.id);
            if (getUser === null) {
                throw new HttpException('Аккаунт не найден', HttpStatus.NOT_FOUND)
            }
            if (getUser.accountStatus === AccountStatusUserEnum.UNAPPROVED) {
                throw new HttpException('Аккаунт не подтвержден', HttpStatus.FORBIDDEN)
            }
            if (getUser.accountStatus === AccountStatusUserEnum.BANNED) {
                throw new HttpException('Аккаунт заблокирован', HttpStatus.FORBIDDEN)
            }
            req.user = user;
            return true;

        } catch (e) {
            throw new UnauthorizedException({ message: 'Невалидный токен' })
        }
    }
}