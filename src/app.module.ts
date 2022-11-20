import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import dataSource from './ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    TypeOrmModule.forRoot(dataSource.options),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
