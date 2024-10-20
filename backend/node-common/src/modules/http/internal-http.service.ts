import {
  CID_HEADER_KEY,
  CONTENT_TYPE_HEADER_KEY,
  ERR,
  REQUEST_INFO_HEADER_KEY,
  USER_INFO_HEADER_KEY,
} from '@constants';
import { Injectable } from '@nestjs/common';
import { AxiosHeaders, AxiosResponse, isAxiosError } from 'axios';
import { ErrorResponse, SuccessResponse } from 'src/models';
import { BusinessException } from '@exceptions';
import HttpClientService from './http-client.abstract';
import axiosRetry from 'axios-retry';
import { AslRequestContext } from '~/shared';
import { requestInfoJson, userInfoJson } from '@utils';

@Injectable()
export class InternalHttpClientService extends HttpClientService {
  constructor() {
    super(AslRequestContext?.req);
    axiosRetry(this.axios, {
      retries: 2,
      retryCondition: (error) =>
        // Retry only on network errors (ECONNRESET, etc.)
        axiosRetry.isNetworkError(error),
      /**
       * Function that returns the delay in milliseconds between retries.
       * @param retryCount number of retries attempted so far
       * @returns delay in milliseconds
       */
      retryDelay: (retryCount) => {
        return retryCount * 1000;
      },
    });
  }

  protected override buildHeaders(headers: Record<string, string> | AxiosHeaders): AxiosHeaders {
    const axiosHeaders = new AxiosHeaders(headers);
    axiosHeaders.set(CONTENT_TYPE_HEADER_KEY, 'application/json');
    axiosHeaders.set(CID_HEADER_KEY, this.request?.ctx?.cid);

    if (this?.request?.ctx?.requestInfo) {
      axiosHeaders.set(
        REQUEST_INFO_HEADER_KEY,
        Buffer.from(requestInfoJson(this.request.ctx.requestInfo)).toString('base64'),
      );
    }

    if (this.request?.ctx?.userInfo) {
      axiosHeaders.set(
        USER_INFO_HEADER_KEY,
        Buffer.from(userInfoJson(this.request.ctx.userInfo)).toString('base64'),
      );
    }

    return new AxiosHeaders(axiosHeaders);
  }

  protected override handleResponse<T>(res: AxiosResponse<T>): T {
    if (isAxiosError(res)) {
      const code = (res as any)?.code || 'Unknown';

      const errorResData = (res as any)?.response || res?.data || {};

      // error maybe some server died
      if (errorResData.status >= 500 || !errorResData.status) {
        errorResData.data = { ...errorResData?.data };

        errorResData['data']['errorCode'] = this.nameService + '_' + code;
      }

      throw new BusinessException({
        errorCode: errorResData?.errCode ?? (res.code as ERR),
        status: res?.response?.status ?? res?.status,
        err: errorResData?.err,
        data: {
          message: !errorResData?.status
            ? `Call API error with url: ${res?.config?.url}, code: ${code}`
            : errorResData?.data?.err,
        },
      });
    } else if (res.status >= 200 && res.status < 300) {
      const successResData = res.data as SuccessResponse<T>;
      return successResData.data;
    }

    return {} as T;
  }
}
