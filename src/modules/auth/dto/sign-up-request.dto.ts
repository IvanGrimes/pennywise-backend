import { CreateUserRequestDto } from '@modules/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { IsStrongPassword } from '@lib/app/decorators';

export class SignUpRequestDto implements CreateUserRequestDto {
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
  @IsEmail(undefined, { message: 'Email must be a valid email address' })
  readonly email!: string;

  @ApiProperty({ description: 'The password of a user', minLength: 6 })
  @IsStrongPassword()
  readonly password!: string;
}
