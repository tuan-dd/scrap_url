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
import { AppLogger } from '@shared';
import { FastifyRequest } from 'fastify';
import { loggerRequestJson, loggerResponseJson } from '@utils/validator';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse();
    const ctx = request.ctx;
    this.logger.info(
      loggerRequestJson({
        request: `Accepted Request [${ctx.cid}] - ${request.url} - ${request.method}`,
        method: request.method,
        url: request.url,
        cid: ctx.cid,
        timestamp: ctx.requestTimestamp,
        userId: ctx.userInfo?.userId,
      }),
    );

    return next.handle().pipe(
      tap(() =>
        this.logger.info(
          loggerResponseJson({
            response: `Response [${ctx.cid}] - [${response.statusCode}]: ${formatMilliseconds(new Date().getTime() - ctx.requestTimestamp)}`,
            status: response.statusCode,
            cid: ctx.cid,
            userId: ctx.userInfo?.userId,
          }),
        ),
      ),
      catchError((err) => {
        this.logger.error(
          loggerResponseJson({
            response: `$Exception  [${ctx.cid}] - [${response.statusCode}]: ${formatMilliseconds(new Date().getTime() - ctx.requestTimestamp)}`,
            status: err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
            cid: ctx.cid,
            stackTraces: err.stack,
            error: err?.code ?? err?.errorCode,
            userId: ctx.userInfo?.userId,
          }),
        );
        return throwError(() => err);
      }),
    );
  }
}
