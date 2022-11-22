import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entity/user.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  providers: [AuthService, UsersService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
    TypeOrmModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY as string,
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
