import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty()
  readonly email: string;
  @ApiProperty()
  readonly password: string;
}