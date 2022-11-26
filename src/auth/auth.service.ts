import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SignInDto } from './dto/signin-dto';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entity/user.entity';
import { Token } from './models/token.model';
import { ExceptionsMessage, IsBlockedStatus } from 'src/app.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  hashData(data: string): Promise<string> {
    return bcrypt.hash(data, +process.env.CRYPT_SALT);
  }

  async getToken(userId: string, login: string): Promise<Token> {
    const accessToken = this.jwtService.sign({ login, sub: userId });
    return {
      access_token: accessToken,
    };
  }

  async register(userDto: CreateUserDto): Promise<Token> {
    const date = String(new Date().getTime());
    const passwordHash = await this.hashData(userDto.password);
    const newUser = await this.userService.createUser({
      ...userDto,
      password: passwordHash,
      createdAt: date,
      updatedAt: date,
      status: IsBlockedStatus.ACTIVE_STATUS,
    });
    await this.checkUser(newUser.login);
    const token = await this.getToken(newUser.id, newUser.login);
    return token;
  }

  async login({ login, password }: SignInDto): Promise<Token> {
    const user = await this.checkUser(login);
    await this.checkPassword(password, user.password);
    await this.userService.createUser({ ...user, updatedAt: String(new Date().getTime()) });
    const token = await this.getToken(user.id, user.login);
    return token;
  }

  async checkUser(login: string) {
    const user = await this.userRepository.findOne({ where: { login: login } });
    if (!user) {
      throw new ForbiddenException(ExceptionsMessage.NOT_FOUND_USER);
    }
    if (user.status === IsBlockedStatus.BLOCKED_STATUS) {
      throw new ForbiddenException(ExceptionsMessage.STATUS_BLOCKED);
    }
    return user;
  }

  async checkPassword(password: SignInDto['password'], existsPassword: string) {
    const passwordMatch = await bcrypt.compare(password, existsPassword);
    if (!passwordMatch) {
      throw new ForbiddenException(ExceptionsMessage.FORBIDDEN);
    }
  }
}
