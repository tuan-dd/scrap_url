import { AxiosHeaders } from 'axios';
import { RequestContext } from '..';

declare global {
  // eslint-disable-next-line  @typescript-eslint/no-namespace
  namespace Fastify {
    export interface FastifyRequest {
      serviceContext: RequestContext;
    }
  }

  namespace fastify {
    export interface FastifyRequest {
      serviceContext: RequestContext;
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    ctx: RequestContext;
  }
}
