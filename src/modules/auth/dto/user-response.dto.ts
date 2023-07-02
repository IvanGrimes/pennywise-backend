import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  constructor({ firstName, lastName, email }: UserResponseDto) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}
