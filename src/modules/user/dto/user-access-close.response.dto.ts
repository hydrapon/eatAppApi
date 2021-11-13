import { User } from '../user.entity';
import { UserDto } from './user.dto';

export class UserAccessCloseResponseDto {
    readonly id: number;
    readonly name: string;
    readonly surname: string;
    readonly close: boolean;
    readonly message: string;

    constructor(user: User | UserDto, message: string) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.close = true;
        this.message = message;
    }
}