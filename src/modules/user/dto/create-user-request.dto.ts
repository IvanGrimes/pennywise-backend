import {
  MinLength,
  MaxLength,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({
    description: 'The first name of a user',
    minLength: 2,
    maxLength: 64,
  })
  @MinLength(2)
  @MaxLength(64)
  readonly firstName!: string;

  @ApiProperty({
    description: 'The last name of a user',
    minLength: 2,
    maxLength: 64,
  })
  @MinLength(2)
  @MaxLength(64)
  readonly lastName!: string;

  @ApiProperty({ description: 'The email of a user' })
  @IsEmail()
  readonly email!: string;

  @ApiProperty({ description: 'The password of a user', minLength: 6 })
  @IsStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  readonly password!: string;
}
