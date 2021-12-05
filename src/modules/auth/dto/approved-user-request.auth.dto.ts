import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ApprovedUserRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @MaxLength(32)
  @MinLength(32)
  @IsString()
  @IsOptional()
  readonly hash?: string;

  @ApiProperty()
  @MaxLength(6)
  @MinLength(6)
  @IsString()
  @IsOptional()
  readonly code?: string;
}