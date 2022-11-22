import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import { CreateUserDto } from './dto/create-user-dto';
import { UpdatePasswordDto } from './dto/update-user-dto';
import { User, UserResponse } from './models/users.interface';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  private users: Array<User> = [];

  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

  public async findAll() {
    const users = await this.userRepository.find();
    return users.map((user) => user.toResponse());
  }

  public async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (user) return user.toResponse();
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  public async createUser(dto: CreateUserDto): Promise<UserResponse> {
    const userCreated = this.userRepository.create({
      ...dto,
      createdAt: String(new Date().getTime()),
      updatedAt: String(new Date().getTime()),
    });
    if (userCreated) {
      const user = (await this.userRepository.save(userCreated)).toResponse();
      return user;
    }
    throw new HttpException('Bad request', StatusCodes.BAD_REQUEST);
  }

  public async update(id: string, userDto: UpdatePasswordDto) {
    const userUpdated = await this.userRepository.findOne({ where: { id: id } });
    if (!validate({ id })) {
      throw new HttpException('User not found', StatusCodes.BAD_REQUEST);
    }
    if (!userUpdated) {
      throw new NotFoundException('User not found');
    }
    if (userDto.newPassword === userUpdated.password) {
      throw new ForbiddenException('Forbidden');
    }
    Object.assign(userUpdated, userDto);
    return await this.userRepository.save({
      ...userUpdated,
      password: userDto.newPassword,
      updatedAt: String(new Date().getTime()),
    });
  }

  public async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    if (!validate({ id })) {
      throw new HttpException('User not found', StatusCodes.BAD_REQUEST);
    }
  }
}
