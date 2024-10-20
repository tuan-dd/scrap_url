import { Injectable } from '@nestjs/common';
import { AxiosHeaders, AxiosResponse, isAxiosError } from 'axios';
import HttpClientService from '~/modules/http/http-client.abstract';

@Injectable()
export class GoogleChatHttpClientService extends HttpClientService {
  constructor() {
    super(undefined);
  }
  protected buildHeaders(headers: Record<string, string | number> | AxiosHeaders): AxiosHeaders {
    return new AxiosHeaders(headers);
  }
  protected handleResponse<T>(res: AxiosResponse<T, any>): T {
    if (isAxiosError(res))
      throw {
        ...res,
        customExceptionType: 'GOOGLE_EXCEPTION',
      };
    return res.data;
  }
}
