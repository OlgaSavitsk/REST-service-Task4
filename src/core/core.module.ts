import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AccessAuthGuard } from './guards/access.guard';

@Module({
  controllers: [],
  providers: [
    /* {
      provide: APP_GUARD,
      useClass: AccessAuthGuard,
    }, */
  ],
  imports: [],
})
export class CoreModule {}
