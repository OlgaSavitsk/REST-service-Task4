import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User, UserResponse } from './models/users.interface';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<UserResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return next.handle().pipe(map(({ password, ...user }: User) => user));
  }
}
