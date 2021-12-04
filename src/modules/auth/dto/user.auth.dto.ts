import { UsersEntity } from 'src/database/models/users.entity';

export class UserAuthDto {
  id: number;
  status: string;

  constructor(user: UsersEntity) {
    this.id = user.id;
    this.status = user.status;
  }
}