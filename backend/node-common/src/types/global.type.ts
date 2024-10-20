import { RequestContext, RequestInfo } from '..';

declare module 'fastify' {
  interface FastifyRequest {
    ctx: RequestContext;
  }
}
