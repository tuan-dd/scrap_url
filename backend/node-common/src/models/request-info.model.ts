export class UserInfo {
  userId: number;
  [k: string]: any;
}
export class RequestContext {
  cid: string;
  requestTimestamp: number;
  accessToken: string;
  refreshToken?: string;
  userInfo?: UserInfo;
  constructor(data: Partial<RequestContext>) {
    Object.assign(this, data);
  }
}
