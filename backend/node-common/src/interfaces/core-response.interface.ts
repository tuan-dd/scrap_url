import { ERR } from '..';

export interface CoreResponse<T = any> {
  cid: string;
  err?: string;
  errCode?: ERR | string;
  timestamp: number;
  responseTime: string;
  data: T;
}
