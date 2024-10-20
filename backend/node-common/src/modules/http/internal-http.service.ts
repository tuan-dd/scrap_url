import { CID_HEADER_KEY, CONTENT_TYPE_HEADER_KEY, USER_INFO_HEADER_KEY } from '@constants';
import { Injectable } from '@nestjs/common';
import { AxiosHeaders, AxiosResponse, isAxiosError } from 'axios';
import { ErrorResponse, SuccessResponse } from 'src/models';
import { ERR } from '~/enums';
import { BusinessException } from '~/exceptions';
import HttpClientService from './http-client.abstract';
import axiosRetry from 'axios-retry';
import { AslRequestContext } from '~/shared';

@Injectable()
export class InternalHttpClientService extends HttpClientService {
  constructor() {
    super(AslRequestContext.context.req);
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
      /******  d17570ea-a142-4fc3-98fc-6350e6d51806  *******/
      retryDelay: (retryCount) => {
        return retryCount * 1000;
      },
    });
  }

  protected override buildHeaders(headers: Record<string, string> | AxiosHeaders): AxiosHeaders {
    const axiosHeaders = new AxiosHeaders(headers);
    axiosHeaders.set(CONTENT_TYPE_HEADER_KEY, 'application/json');
    axiosHeaders.set(CID_HEADER_KEY, this.request?.ctx?.cid);
    if (this.request.ctx.userInfo) {
      axiosHeaders.set(
        USER_INFO_HEADER_KEY,
        Buffer.from(JSON.stringify(this.request.ctx.userInfo)).toString('base64'),
      );
    }

    return new AxiosHeaders(axiosHeaders);
  }

  protected override handleResponse<T>(res: AxiosResponse<T>): T {
    if (isAxiosError(res)) {
      const errorResData = res?.response?.data as ErrorResponse;
      throw new BusinessException({
        errorCode: errorResData?.errCode ?? (res.code as ERR),
        status: res?.response?.status ?? res?.status,
        err: errorResData?.err,
      });
    } else if (res.status >= 200 && res.status < 300) {
      const successResData = res.data as SuccessResponse<T>;
      return successResData.data;
    }
  }
}
