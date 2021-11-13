import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly surname: string;

    @ApiProperty()
    readonly birthday: Date;

    @ApiProperty()
    readonly status: string;

    @ApiProperty()
    readonly avatar: string;

    readonly accountStatus: string;

    constructor(user: User | UserDto) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.surname = user.surname;
        this.birthday = user.birthday;
        this.status = user.status;
        this.avatar = user.avatar;
        this.accountStatus = user.accountStatus;
    }
}