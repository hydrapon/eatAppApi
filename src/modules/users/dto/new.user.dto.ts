import { RegistrationUserDto } from 'src/modules/auth/dto/registration.auth.dto';

export class NewUserDto {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly surname: string;
  readonly birthday: Date;

  constructor(passHash: string, regDto: RegistrationUserDto) {
    this.email = regDto.email;
    this.password = passHash;
    this.name = regDto.name;
    this.surname = regDto.surname;
    this.birthday = regDto.birthday;
  }
}