import { AxiosHeaders } from 'axios';

export type HttpClientCustomContext = {
  headers: Record<string, string> | AxiosHeaders;
  baseURL: string;
};
