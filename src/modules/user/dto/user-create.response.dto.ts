import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';
import { UserDto } from './user.dto';

export class UserCreateResponseDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly name: string;

    constructor(user: User | UserDto) {
        this.id = user.id;
        this.name = user.name;
    }
}