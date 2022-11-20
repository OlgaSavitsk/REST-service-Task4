import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  id?: string;

  @ApiProperty({ example: 'test', description: 'Unique login' })
  @IsNotEmpty({ message: 'The user login cannot be empty' })
  @IsString({ message: 'The user login must be a string' })
  oldPassword: string;

  @ApiProperty({ example: '123R', description: 'Password' })
  @IsNotEmpty({ message: 'The user password cannot be empty' })
  @IsString({ message: 'The user password must be a string' })
  newPassword: string;
}
