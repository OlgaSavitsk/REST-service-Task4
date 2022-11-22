import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signin-dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entity/user.entity';
import { Token } from './models/token.model';

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
    const passwordHash = await this.hashData(userDto.password);
    const newUser = await this.userService.createUser({ ...userDto, password: passwordHash });
    const token = await this.getToken(newUser.id, newUser.login);
    return token;
  }

  async login(body: SignInDto): Promise<Token> {
    const user = await this.userRepository.findOne({ where: { login: body.login } });
    if (!user) {
      throw new ForbiddenException('User with login not found');
    }
    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordMatch) {
      throw new ForbiddenException("Password doesn't match");
    }
    const token = await this.getToken(user.id, user.login);
    return token;
  }
}
