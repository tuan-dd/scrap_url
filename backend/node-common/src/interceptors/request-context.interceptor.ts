import {
  AUTHORIZATION,
  CID_HEADER_KEY,
  REQUEST_INFO_HEADER_KEY,
  USER_INFO_HEADER_KEY,
} from '~/constants';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { RequestContext } from '~/models';
import { generateCID } from '~/utils';
import { FastifyRequest, FastifyReply } from 'fastify';
import { map, Observable } from 'rxjs';
import * as geoIp from 'geoip-lite';
import { AslRequestContext } from '~/shared';
@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const response = httpContext.getResponse<FastifyReply>();

    const tokenPrefix = 'Bearer ';
    const cid =
      (request.headers[CID_HEADER_KEY] as string) ||
      (request.headers[CID_HEADER_KEY.toUpperCase()] as string);

    const authorization =
      (request.headers[AUTHORIZATION] as string) ||
      (request.headers[AUTHORIZATION.toUpperCase()] as string);

    request.ctx = new RequestContext({
      cid: generateCID(cid),
      requestTimestamp: this.getTimestamp(),
      accessToken: authorization?.replace(tokenPrefix, ''),
    });

    let requestInfo = request.headers[REQUEST_INFO_HEADER_KEY] as string;

    if (requestInfo) {
      try {
        requestInfo = Buffer.from(requestInfo, 'base64').toString('utf-8');
        request.ctx.requestInfo = JSON.parse(requestInfo);
      } catch (error) {
        console.warn('Error parsing request info', error);
      }
    } else {
      const ip = request.headers['x-forwarded-for'] || request.ip;
      const location = geoIp.lookup(ip);
      request.ctx.requestInfo = {
        ipAddress: ip as string,
        location: location?.country || null,
        userAgent: request.headers['user-agent'],
      };
    }

    const userInfoBase64 = request.headers[USER_INFO_HEADER_KEY] as string;
    if (userInfoBase64) {
      try {
        const userInfoStr = Buffer.from(userInfoBase64, 'base64').toString('utf-8');
        request.ctx.userInfo = JSON.parse(userInfoStr);
      } catch (error) {
        console.warn('Error parsing user info', error);
      }
    }
    return AslRequestContext.cls.run(new AslRequestContext(request, response), () =>
      next.handle().pipe(map((data) => data)),
    );
  }

  getTimestamp = () => new Date().getTime();
}
