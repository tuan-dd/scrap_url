import { UserTypeEnum } from '~/enums';

export class UserInfo {
  userId: number;
  type: UserTypeEnum;
  [k: string]: any;
}
export class RequestContext {
  cid: string;
  requestTimestamp: number;
  accessToken?: string;
  refreshToken?: string;
  userInfo?: UserInfo;
  requestInfo?: RequestInfo;
  constructor(data: Partial<RequestContext>) {
    Object.assign(this, data);
  }
}

export class RequestInfo {
  ipAddress: string;
  location?: string;
  userAgent?: string;
  constructor(data: Partial<RequestInfo>) {
    Object.assign(this, data);
  }
}
