import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { HttpClientCustomContext } from './http-client.model';
import { FastifyRequest } from 'fastify';
type RequestHeaders = Record<string, string | number> | AxiosHeaders;

export default abstract class HttpClientService {
  protected context: HttpClientCustomContext;
  protected readonly axios: AxiosInstance;
  protected nameService = '';
  protected abstract buildHeaders(headers: RequestHeaders): AxiosHeaders;
  protected abstract handleResponse<T>(res: AxiosResponse<T>): T;
  constructor(protected readonly request?: FastifyRequest) {
    this.axios = axios.create({
      headers: {},
      timeout: 0,
      maxRedirects: 3,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
  }

  public setName(name: string) {
    this.nameService = name;
  }

  public setContextInfo(context: HttpClientCustomContext) {
    this.context = context;
  }

  async get<T>(url: string, qs?: any, headers?: any, config?: AxiosRequestConfig<any>): Promise<T> {
    headers = this.buildHeaders({ ...this.context?.headers, ...headers });
    const response = await this.axios
      .get<T>(url, { headers, params: qs, ...config, baseURL: this.context?.baseURL })
      .catch((ex) => ex);
    return this.handleResponse(response);
  }

  async post<T>(url: string, data: any, headers?: RequestHeaders): Promise<T> {
    headers = this.buildHeaders({ ...this.context?.headers, ...headers });
    const response = await this.axios
      .post<T>(url, data, {
        baseURL: this.context?.baseURL,
        headers,
      })
      .catch((ex) => ex);
    return this.handleResponse(response);
  }

  async put<T>(url: string, data: any, headers?: RequestHeaders): Promise<T> {
    headers = this.buildHeaders({ ...this.context?.headers, ...headers });
    const response = await this.axios
      .put<T>(url, data, {
        baseURL: this.context?.baseURL,
        headers,
      })
      .catch((ex) => ex);
    return this.handleResponse(response);
  }

  async patch<T>(url: string, data: any, headers?: RequestHeaders): Promise<T> {
    headers = this.buildHeaders({ ...this.context?.headers, ...headers });
    const response = await this.axios
      .patch<T>(url, data ?? {}, {
        baseURL: this.context?.baseURL,
        headers,
      })
      .catch((ex) => ex);
    return this.handleResponse(response);
  }

  async delete(url: string, data = {}, headers?: RequestHeaders) {
    headers = this.buildHeaders({ ...this.context?.headers, ...headers });
    const response = await this.axios
      .delete(url, { baseURL: this.context?.baseURL, headers, data })
      .catch((ex) => ex);
    return this.handleResponse(response);
  }

  async forward<T>(
    url: string,
    method: Method,
    data?: any,
    params?: any,
    headers?: any,
  ): Promise<T> {
    headers = this.buildHeaders({ ...this.context?.headers, ...headers });
    const response = await axios
      .request<T>({
        url,
        method,
        data: data ?? {},
        headers,
        params,
        baseURL: this.context?.baseURL,
      })
      .catch((ex) => ex);
    return this.handleResponse(response);
  }

  async forwardFromRequest<T>(
    url: string,
    method: Method,
    headers?: any,
    isAddParams = true,
  ): Promise<T> {
    headers = this.buildHeaders({ ...this.context?.headers, ...headers });
    const response = await axios
      .request<T>({
        url: isAddParams ? url + '/' + Object.values(this.request?.params || {}).join('/') : url,
        method,
        data: await this.request?.body,
        headers,
        params: this.request?.query,
        baseURL: this.context?.baseURL,
      })
      .catch((ex) => ex.response);
    return this.handleResponse(response);
  }
}
