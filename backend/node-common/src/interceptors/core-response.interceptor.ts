import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { map, Observable } from 'rxjs';
import { IGNORE_CORE_RESPONSE_KEY } from '~/constants';
import { CoreResponse } from '~/interfaces';
import { SuccessResponse } from '~/models';
import { formatMilliseconds } from '~/utils';

@Injectable()
export class CoreResponseInterceptor<T> implements NestInterceptor<T, Partial<CoreResponse<T>>> {
  constructor(public readonly reflector: Reflector) {}
  private checkExcludeInterceptor(ctx: ExecutionContext) {
    return (
      this.reflector.get(IGNORE_CORE_RESPONSE_KEY, ctx.getClass()) ||
      this.reflector.get(IGNORE_CORE_RESPONSE_KEY, ctx.getHandler())
    );
  }
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<SuccessResponse<T>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    return next.handle().pipe(
      map((data) => {
        if (this.checkExcludeInterceptor(context)) return data as CoreResponse<T>;
        return new SuccessResponse<T>({
          cid: request.ctx?.cid,
          data: instanceToPlain(data, {
            strategy: 'exposeAll',
            excludePrefixes: [
              '_',
              '__',
              'createdAt',
              'createdBy',
              'updatedAt',
              'updatedBy',
              'isDeleted',
            ],
            exposeUnsetFields: true,
          }) as T,
          responseTime: formatMilliseconds(new Date().getTime() - request.ctx?.requestTimestamp),
          timestamp: request.ctx?.requestTimestamp,
        });
      }),
    );
  }
}
