import {
  ClassConstructor,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export function Respond<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new RespondInterceptor(dto));
}

class RespondInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<T> | Promise<Observable<T>> {
    // run something before a request is handled
    // by the request handler

    return next.handle().pipe(
      map((data: T) => {
        // run something before the response is sent out
        return instanceToPlain(
          plainToInstance(this.dto, data, {
            excludeExtraneousValues: true,
          }),
        ) as T;
      }),
    );
  }
}
