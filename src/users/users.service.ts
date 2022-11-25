import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';

import { CreateUserDto } from './dto/create-user-dto';
import { User } from './models/users.interface';
import { UserEntity } from './entity/user.entity';
import { ExceptionsMessage } from 'src/app.constant';

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
    return user.toResponse() ?? null;
  }

  public async createUser(dto: CreateUserDto) {
    const userCreated = this.userRepository.create(dto);
    if (userCreated) {
      const user = (await this.userRepository.save(userCreated)).toResponse();
      return user;
    }
    throw new HttpException(ExceptionsMessage.BAD_REQUEST, StatusCodes.BAD_REQUEST);
  }

  public async update(id: string, newStatus) {
    const userUpdated = await this.userRepository.findOne({ where: { id: id } });
    if (!userUpdated) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_USER);
    }
    if (newStatus === userUpdated.status) {
      throw new ForbiddenException(ExceptionsMessage.FORBIDDEN);
    }
    const updateUser = await this.userRepository.save({
      ...userUpdated,
      status: newStatus,
    });
    return updateUser;
  }

  public async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_USER);
    }
  }
}
