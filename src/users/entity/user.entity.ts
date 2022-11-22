import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426655440000', description: 'UserId UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Alex', description: 'Username' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Alex24', description: 'Userlogin' })
  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  createdAt?: string;

  @Column()
  updatedAt?: string;

  toResponse() {
    const { id, name, login, createdAt, updatedAt } = this;
    return { id, name, login, createdAt, updatedAt };
  }
}
