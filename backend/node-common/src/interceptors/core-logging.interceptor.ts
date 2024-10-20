import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { formatMilliseconds } from '..';
import { CustomLogger } from '~/shared';
import { FastifyRequest } from 'fastify';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse();
    const ctx = request.ctx;

    this.logger.info(`Accepted Request [${ctx.cid}] - ${request.url} - ${request.method}`, {
      method: request.method,
      url: request.url,
      cid: ctx.cid,
      timestamp: ctx.requestTimestamp,
      userId: ctx.userInfo?.userId,
    });

    return next.handle().pipe(
      tap(() =>
        this.logger.info(
          `Response [${ctx.cid}] - [${response.statusCode}]: ${formatMilliseconds(new Date().getTime() - ctx.requestTimestamp)}`,
          {
            status: response.statusCode,
            cid: ctx.cid,
          },
        ),
      ),
      catchError((err) => {
        this.logger.error(
          `$Exception  [${ctx.cid}] - [${response.statusCode}]: ${formatMilliseconds(new Date().getTime() - ctx.requestTimestamp)}`,
          {
            status: err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            cid: ctx.cid,
            stackTraces: err.stack,
            error: err?.code ?? err?.errorCode,
          },
        );
        return throwError(() => err);
      }),
    );
  }
}
