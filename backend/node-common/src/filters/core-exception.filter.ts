import { MODULE_OPTIONS_TOKEN } from '@constants';
import { type ConfigModuleOptions } from '@interfaces';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core';
import { formatMilliseconds } from '@utils';
import _ from 'lodash';
import { ErrorResponse } from '~/models';
import { BusinessException, ERR } from '..';
import { AppLogger } from '~/shared';
import { FastifyReply, FastifyRequest } from 'fastify';

type ExceptionResponse =
  | {
      data?: unknown;
      statusCode: number;
      message: string | string[];
      error: string;
    }
  | string;
@Catch()
@Injectable()
export class CoreExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly registerOption: ConfigModuleOptions,
    private readonly customLogger: AppLogger,
  ) {}

  /**
   * Handles exceptions thrown in the NestJS application and returns an appropriate error response.
   * @param exception - The exception object that was thrown.
   * @param host - The host object that contains the request and response objects.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    let errMsg: string;
    let errCode: ERR;
    if (exception instanceof BusinessException) {
      const bizException = exception as BusinessException;
      response.status(bizException.status);
      errMsg = bizException?.err;
      errCode = bizException?.errorCode ?? ERR.E_RUNTIME_EXCEPTION;
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse() as ExceptionResponse;
      if (typeof res === 'object' && Array.isArray(res.message)) {
        const { message } = res;
        errMsg = _.first(message);
      } else if (typeof res === 'object' && typeof res.message === 'string') {
        errMsg = res.message;
      } else if (typeof res === 'string') {
        errMsg = res;
      }
      response.status(exception.getStatus());
    } else {
      response.status(500);
    }

    const resData = new ErrorResponse({
      timestamp: request.ctx?.requestTimestamp,
      cid: request.ctx?.cid,
      responseTime: this.calculateResponseTime(request.ctx?.requestTimestamp),
      err: errMsg ?? this.getErrorMessage(exception),
      errCode,
    });

    response.send(resData);

    return resData;
  }

  /**
   * Gets the error message based on the environment and the exception's stack or message.
   * @param exception - The exception object.
   * @returns The error message.
   */
  private getErrorMessage(exception: HttpException): string {
    if (this.registerOption.env === 'development') {
      return exception?.stack ?? exception?.message ?? 'Internal Server Error';
    } else {
      return 'Internal Server Error';
    }
  }

  /**
   * Calculates the response time based on the given timestamp.
   * @param timestamp - The timestamp of the request.
   * @returns The formatted response time.
   */
  private calculateResponseTime(timestamp: number): string {
    const responseTime = new Date().getTime() - timestamp;
    return formatMilliseconds(responseTime);
  }
}
