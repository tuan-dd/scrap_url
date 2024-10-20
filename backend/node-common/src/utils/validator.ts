import fastJson from 'fast-json-stringify';
export const alphabetRegex = /^[A-Za-zÀ-ỹ]+(?:\s[A-Za-zÀ-ỹ]+)*$/;
export const dateStringRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;

export const imageRegex = /\.(jpg|jpeg|png|gif)$/;
export const videoRegex = /\.(mp4|mp3|ts)$/;

export const MONTH_REGEX = /^(0[1-9]|1[0-2])\/([1-9][0-9]{3})$/;

export const VERSION_REGEX = /^(?:[1-9]?[0-9]|0)\.(?:[1-9]?[0-9]|0)\.(?:[1-9]?[0-9]|0)$/;

export const PHONE_NUMBER_REGEX = /(03|05|07|08|09)+([0-9]{8})\b/;

export const loggerRequestJson = fastJson({
  title: 'Request Schema',
  type: 'object',
  properties: {
    method: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    cid: {
      type: 'string',
    },
    timestamp: {
      type: 'integer',
    },
    userId: {
      type: 'integer',
    },
  },
});

export const loggerResponseJson = fastJson({
  title: 'Response Schema',
  type: 'object',
  properties: {
    cid: {
      type: 'string',
    },
    status: {
      type: 'integer',
    },
    error: {
      description: 'error code',
      type: 'string',
    },
    stackTraces: {
      type: 'object',
    },
  },
});

export const userInfoJson = fastJson({
  title: 'User Info',
  type: 'object',
  properties: {
    userId: {
      type: 'integer',
    },
  },
});
