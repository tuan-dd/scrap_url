import { ERR } from '..';

export interface CoreResponse<T = any> {
  cid: string;
  err: string;
  errCode: ERR;
  timestamp: number;
  responseTime: string;
  data: T;
}
