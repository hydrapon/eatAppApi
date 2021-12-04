import { ApiProperty } from '@nestjs/swagger';

export class RegistrationUserDto {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly surname: string;

  @ApiProperty()
  readonly birthday: string;
}