import { AsyncLocalStorage } from 'async_hooks';
import { FastifyRequest, FastifyReply } from 'fastify';
export class AslRequestContext {
  static cls = new AsyncLocalStorage<AslRequestContext>();

  static get ctx() {
    return this.cls.getStore()?.req?.ctx;
  }

  static get req() {
    return this.cls.getStore()?.req;
  }

  static get res() {
    return this.cls.getStore()?.res;
  }

  constructor(
    public readonly req: FastifyRequest,
    public readonly res: FastifyReply,
  ) {}
}
