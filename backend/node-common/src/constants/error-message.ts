import { HttpStatus } from '@nestjs/common';
import { BusinessException } from 'src/exceptions';

export enum ERR {
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRES = 'TOKEN_EXPIRES',
  NOT_FOUND = 'NOT_FOUND',
  NO_SERVICE = 'NO_SERVICE',
  INVALID_FILE_FORMAT = 'INVALID_FILE_FORMAT',
  INVALID_REQUEST = 'INVALID_REQUEST',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  DUPLICATE_DATA = 'DUPLICATE_DATA',
  SEND_ALERT_FAILED = 'SEND_ALERT_FAILED',
  MISS_FIELD_HEADER = 'MISS_FIELD_HEADER',
  INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT',
  E_RUNTIME_EXCEPTION = 'E_RUNTIME_EXCEPTION',
  BANNED_OR_FORBIDDEN = 'BANNED_OR_FORBIDDEN',
  DATABASE_ERROR = 'DATABASE_ERROR',
  E_ROUTE_NOT_FOUND = 'E_ROUTE_NOT_FOUND',
  CUSTOM_ERROR = 'CUSTOM_ERROR',
}

export const ERROR_MSG: Record<ERR, (message?: string, ...args: any) => BusinessException> = {
  CUSTOM_ERROR: (
    message = '',
    status?: HttpStatus,
    errorCode?: ERR & string,
    data?: Record<string, any>,
  ) =>
    new BusinessException({
      errorCode: errorCode ?? ERR.UNEXPECTED_ERROR,
      err: message ?? '',
      status: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      data,
    }),
  [ERR.BAD_USER_INPUT]: (message = '', data = {}) =>
    new BusinessException({
      err: message ?? 'Request wrong format',
      status: HttpStatus.BAD_REQUEST,
      errorCode: ERR.BAD_USER_INPUT,
      data,
    }),
  [ERR.INVALID_FILE_FORMAT]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'File wrong format',
      status: HttpStatus.BAD_REQUEST,
      errorCode: ERR.INVALID_FILE_FORMAT,
      data,
    }),
  [ERR.INVALID_REQUEST]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Request wrong format',
      status: HttpStatus.BAD_REQUEST,
      errorCode: ERR.INVALID_REQUEST,
      data,
    }),
  [ERR.INVALID_TOKEN]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Invalid Token',
      status: HttpStatus.UNAUTHORIZED,
      errorCode: ERR.INVALID_TOKEN,
      data,
    }),
  [ERR.NOT_FOUND]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Not fount event',
      status: HttpStatus.NOT_FOUND,
      errorCode: ERR.NOT_FOUND,
      data,
    }),
  [ERR.NO_SERVICE]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Not provide the service',
      status: HttpStatus.BAD_REQUEST,
      errorCode: ERR.NO_SERVICE,
      data,
    }),
  [ERR.SEND_ALERT_FAILED]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Cant not send alert',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: ERR.SEND_ALERT_FAILED,
      data,
    }),
  [ERR.TOKEN_EXPIRES]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Token is expires login again',
      status: HttpStatus.UNAUTHORIZED,
      errorCode: ERR.TOKEN_EXPIRES,
      data,
    }),
  [ERR.UNEXPECTED_ERROR]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Server has by unexpected error. We fixed them soon',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorCode: ERR.UNEXPECTED_ERROR,
      data,
    }),
  [ERR.MISS_FIELD_HEADER]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Missing field device id or language code',
      status: HttpStatus.BAD_REQUEST,
      errorCode: ERR.MISS_FIELD_HEADER,
      data,
    }),
  [ERR.DUPLICATE_DATA]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Duplicate Data',
      status: HttpStatus.CONFLICT,
      errorCode: ERR.DUPLICATE_DATA,
      data,
    }),
  [ERR.INVALID_DATE_FORMAT]: (message?: string, data?: any) =>
    new BusinessException({
      err: message ?? 'Wrong date format',
      status: HttpStatus.BAD_REQUEST,
      errorCode: ERR.INVALID_DATE_FORMAT,
      data,
    }),
  [ERR.E_RUNTIME_EXCEPTION]: (message?: string, data?: any) =>
    new BusinessException({
      errorCode: ERR.E_RUNTIME_EXCEPTION,
      err: message ?? 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      data,
    }),
  [ERR.BANNED_OR_FORBIDDEN]: (message?: string, data?: any) =>
    new BusinessException({
      errorCode: ERR.BANNED_OR_FORBIDDEN,
      err: message ?? 'Account was banned',
      status: HttpStatus.FORBIDDEN,
      data,
    }),
  [ERR.DATABASE_ERROR]: (message?: string) =>
    new BusinessException({
      errorCode: ERR.DATABASE_ERROR,
      err: message ?? 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    }),
  [ERR.E_ROUTE_NOT_FOUND]: (message?: string) =>
    new BusinessException({
      errorCode: ERR.NOT_FOUND,
      err: message ?? 'Route Not Found',
      status: HttpStatus.NOT_FOUND,
    }),
};
