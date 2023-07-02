import e from 'express';

export class CreateUserRequestDto {
  firstName!: string;

  lastName!: string;

  email!: string;

  password!: string;

  constructor({ firstName, lastName, email, password }: CreateUserRequestDto) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }
}
