import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  id?: string;

  @ApiProperty({ example: 'Alex', description: 'Username' })
  @IsNotEmpty({ message: 'The user name cannot be empty' })
  @IsString({ message: 'The user name must be a string' })
  name: string;

  @ApiProperty({ example: 'test', description: 'Unique login' })
  @IsNotEmpty({ message: 'The user login cannot be empty' })
  @IsString({ message: 'The user login must be a string' })
  login: string;

  @ApiProperty({ example: '123R', description: 'Password' })
  @IsNotEmpty({ message: 'The user password cannot be empty' })
  @IsString({ message: 'The user password must be a string' })
  password: string;

  createdAt?: string;

  updatedAt?: string;

  status?: string;
}
