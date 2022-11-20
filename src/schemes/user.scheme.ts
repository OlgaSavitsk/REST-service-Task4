import { ApiProperty } from '@nestjs/swagger';

export class UserSchema {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426655440000', description: 'UserId UUID' })
  id: string;

  @ApiProperty({ example: 'Alex', description: 'Unique login' })
  login: string;
}
