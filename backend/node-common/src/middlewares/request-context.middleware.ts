import { AUTHORIZATION, CID_HEADER_KEY, USER_INFO_HEADER_KEY } from '~/constants';
import { Injectable, NestMiddleware } from '@nestjs/common';
// import { RequestContext } from '~/models';
// import { generateCID } from '~/utils';
import { FastifyRequest, FastifyReply } from 'fastify';
// import { AslRequestContext } from '~/shared';
/**
 * TODO not working with Fastify
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor() {}
  use(request: FastifyRequest['raw'], _: FastifyReply['raw'], next: () => void) {
    // const tokenPrefix = 'Bearer ';
    // const cid =
    //   (request.headers[CID_HEADER_KEY] as string) ||
    //   (request.headers[CID_HEADER_KEY.toUpperCase()] as string);
    // const authorization =
    //   (request.headers[AUTHORIZATION] as string) ||
    //   (request.headers[AUTHORIZATION.toUpperCase()] as string);
    // request.b = new RequestContext({
    //   cid: generateCID(cid),
    //   requestTimestamp: this.getTimestamp(),
    //   accessToken: authorization?.replace(tokenPrefix, ''),
    // });
    // const userInfoBase64 = request.headers[USER_INFO_HEADER_KEY] as string;
    // if (userInfoBase64) {
    //   try {
    //     const userInfoStr = Buffer.from(userInfoBase64, 'base64').toString('utf-8');
    //     request.ctx.userInfo = JSON.parse(userInfoStr);
    //   } catch (error) {
    //     console.warn('Error parsing user info', error);
    //   }
    // }
    // AslRequestContext.cls.run(new AslRequestContext(request, _), next);
  }

  getTimestamp = () => new Date().getTime();
}
