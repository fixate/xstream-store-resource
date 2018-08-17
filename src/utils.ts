import {GetUrl} from './types/utils';

const getQueryString = (query: {[key: string]: any} = {}) =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

const getParameteriseUrl = (url: string, params: {[key: string]: any} = {}) => {
  return url
    .split('/')
    .map(part => {
      const isParam = part[0] === ':';

      if (!isParam) {
        return part;
      }

      const param = part.substring(1);
      const value = params[param];

      if (value == null) {
        return '';
      }

      return encodeURIComponent(value);
    })
    .join('/');
};

const getUrl: GetUrl = ({url, baseUrl}, params, query) => {
  const qs = getQueryString(query);
  const parameterizedUrl = getParameteriseUrl(url, params);
  const joinChar = /^\//.test(parameterizedUrl) || /\/$/.test(baseUrl) ? '' : '/';
  const absUrl = [baseUrl, parameterizedUrl].join(joinChar);

  return [absUrl, qs].filter(Boolean).join('?');
};

export {getUrl, getParameteriseUrl, getQueryString};
