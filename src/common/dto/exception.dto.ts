import { ApiProperty } from '@nestjs/swagger';

export class ExceptionDto {
  @ApiProperty()
  readonly statusCode: number;
  @ApiProperty()
  readonly message: string;
}