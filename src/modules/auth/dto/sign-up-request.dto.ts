import { CreateUserRequestDto } from '@modules/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsStrongPassword(
    {
      minNumbers: 1,
      minLength: 6,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message: (args) => {
        const constraints = args.constraints[0];
        console.log(constraints);

        const uppercaseLetters = args.value.match(/[A-Z]/g)?.length ?? 0;

        if (uppercaseLetters < constraints.minUppercase) {
          return `Password must contain ${
            constraints.minUppercase
          } uppercase letter${
            constraints.minUppercase > 1 ? 's' : ''
          } at least`;
        }

        const numbers = args.value.match(/[0-9]/g)?.length ?? 0;

        if (numbers < constraints.minNumbers) {
          return `Password must contain ${constraints.minNumbers} number${
            constraints.minNumbers > 1 ? 's' : ''
          } at least`;
        }

        const specialCharacters =
          args.value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/)?.length ??
          0;

        if (specialCharacters < constraints.minSymbols) {
          return `Password must contain ${
            constraints.minSymbols
          } special character${constraints.minSymbols > 1 ? 's' : ''} at least`;
        }

        if (args.value.length < constraints.minLength) {
          return `Password must be ${constraints.minLength} characters long`;
        }

        return '';
      },
    },
  )
  readonly password!: string;
}
