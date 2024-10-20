import { AsyncLocalStorage } from 'async_hooks';
import { FastifyRequest, FastifyReply } from 'fastify';
export class AslRequestContext {
  static cls = new AsyncLocalStorage<AslRequestContext>();

  static get context() {
    return this.cls.getStore();
  }

  constructor(
    public readonly req: FastifyRequest,
    public readonly res: FastifyReply,
  ) {}
}
