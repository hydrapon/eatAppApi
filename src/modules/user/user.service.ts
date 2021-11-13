import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { USERS_REPOSITORY } from 'src/utils/keys';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs'
import { UserDto } from './dto/user.dto';
import { AccountAccessEnum } from 'src/utils/enum/accountAccess';
import { UserAccessCloseResponseDto } from './dto/user-access-close.response.dto';
// import { UserCreateResponseDto } from './dto/user-create.response.dto';
import { UpdateInfoUserDto } from './dto/update-info.user.dto';
import { UserParamsEnum } from 'src/utils/enum/user-params';
import { PasswordResetUserDto } from './dto/password-reset.user.dto';
import { AccountStatusUserEnum } from 'src/utils/enum/accountStatusUser';

@Injectable()
export class UserService {
    constructor(
        @Inject(USERS_REPOSITORY)
        private readonly userRepo: typeof User
    ) { }

    async createUser(createUserDto: CreateUserDto, hash: string = null, code: number = null): Promise<UserDto> {
        try {
            const user: User = new User();
            user.email = createUserDto.email.trim();
            user.name = this.firstCharUpp(createUserDto.name.trim());
            user.surname = this.firstCharUpp(createUserDto.surname.trim());
            user.birthday = createUserDto.birthday;

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(createUserDto.password, salt);
            user.password = user.password.trim()

            if (hash) {
                user.approvedHash = hash;
            }

            if (code) {
                user.approvedCode = code;
            }

            const saveUserData: User = await user.save();
            return new UserDto(saveUserData)
        } catch (err) {
            if (err.original.constraint === 'users_email_key') {
                throw new HttpException(
                    `Пользователь с email ${createUserDto.email} уже существует`,
                    HttpStatus.CONFLICT,
                );
            }
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserById(id: number, user: UserDto): Promise<UserDto | UserAccessCloseResponseDto | string> {
        const searchUser = await this.userRepo.findByPk(id);
        if (searchUser === null) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }
        if (id === user.id) {
            return new UserDto(searchUser)
        }

        switch (searchUser.account_access) {
            case AccountAccessEnum.ACCESS_ALL:
                return new UserDto(searchUser)
            case AccountAccessEnum.ACCESS_FRIENDS:
                if (searchUser.friends.includes(user.id)) {
                    return new UserDto(searchUser)
                }
                return new UserAccessCloseResponseDto(
                    searchUser,
                    'Аккаунт доступен только для подписчиков'
                )
            case AccountAccessEnum.CLOSE:
                return new UserAccessCloseResponseDto(
                    searchUser,
                    'Аккаунт скрыт от всех пользователей'
                )
            default:
                throw new HttpException('Некорректный статус доступа', HttpStatus.CONFLICT);
        }
    }

    async updateUser(idUpdateUser: number, updateInfoUser: UpdateInfoUserDto, idUser: number) {
        const user = await this.userRepo.findByPk(idUpdateUser);
        if (user === null) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }

        let updateParams: Record<string, string | number> = {};
        Object.keys(updateInfoUser).forEach((keyDto) => {
            if (Object.values(UserParamsEnum).find(valueEnum => valueEnum === keyDto)) {
                if (keyDto === UserParamsEnum.NAME || keyDto === UserParamsEnum.SURNAME) {
                    user[keyDto] = this.firstCharUpp(updateInfoUser[keyDto])
                } else {
                    user[keyDto] = updateInfoUser[keyDto]
                }
                updateParams[keyDto] = updateInfoUser[keyDto]
            }
        });

        if (Object.keys(updateParams).length === 0) {
            throw new BadRequestException('Отсутствуют параметры для изменения')
        }

        if (idUpdateUser !== idUser) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        }

        try {
            const data = await user.save();
            return new UserDto(data);
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async changeAccountStatus(status: AccountStatusUserEnum.UNAPPROVED | AccountStatusUserEnum.APPROVED | AccountStatusUserEnum.BANNED, id: number) {
        const user = await this.userRepo.findByPk(id);
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        user.accountStatus = status;
        user.save();
    }

    async passwordReset(idUpdateUser: number, passwordResetUserDto: PasswordResetUserDto, idUser: number) {
        return 'password reset'
    }

    private firstCharUpp(str) {
        return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
    }

}
