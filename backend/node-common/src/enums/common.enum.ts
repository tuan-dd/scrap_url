export enum BooleanEnum {
  TRUE = 'true',
  FALSE = 'false',
}

export enum DateFormat {
  ISO_STRING = 'YYYY-MM-DDTHH:mm:ss.sssZ',
  ISO_STRING_NOT_TZ = 'YYYY-MM-DDTHH:mm:ss.SSS',
  DD_MM_YYYY = 'DD/MM/YYYY',
  DD_MMM_YYYY_WITH_SPACE = 'DD MMM YYYY',
  LT = 'LT',
  DATE_TIME_IMPORT_TRIP = 'YYYY-MM-DDTHH:mm',
  FULL_DATE_TIME = 'YYYY-MM-DD HH:mm:ss',
  FULL_DATE_HYPHEN = 'YYYY-MM-DD',
  INVOICE_NUMBER_FORMAT = 'YYYYMMDD',
}

export enum UserTypeEnum {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum BackOfficeRoles {
  ADMIN = 1,
  MANAGER = 2,
  MEMBER = 3,
  USER = 0,
}

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging',
}

export const alphaNumeric = '0123456789abcdefghjkmnpqrstuvwxyz'.split('');
export const alphaNumericUppercase = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ'.split('');
export const numericCharacters = '0123456789'.split('');
