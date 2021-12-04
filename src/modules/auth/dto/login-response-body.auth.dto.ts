import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseBodyDto {
  @ApiProperty()
  readonly accessToken: string;
}