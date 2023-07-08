import { IsStrongPassword as BaseIsStrongPassword } from 'class-validator';

export const IsStrongPassword = () =>
  BaseIsStrongPassword(
    {
      minNumbers: 1,
      minLength: 6,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message: (args) => {
        const constraints = args.constraints[0];

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
  );
