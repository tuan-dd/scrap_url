export abstract class BaseService<T, R = any> {
  protected client: T;
  protected readonly defaultClient: T;
  constructor(client: T) {
    this.client = client;
    this.defaultClient = client;
  }

  joinTransaction(
    client: Omit<T, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
    _tx?: Omit<R, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
  ) {
    this.client = client as any;
  }

  leftTransaction() {
    this.client = this.defaultClient;
  }
}
