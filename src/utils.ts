import {GetUrl} from './types/utils';

const getQueryString = (query: {[key: string]: any} = {}) =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

const getParameteriseUrl = (url: string, params: {[key: string]: any} = {}) => {
  const {id, ...restParams} = params;

  return url
    .split('/')
    .map(part => {
      const isParam = /^:/.test(part);
      const param = part.replace(':', '');
      const value = restParams[param];

      return isParam && value ? encodeURIComponent(value) : part;
    })
    .concat(id)
    .filter(Boolean)
    .join('/');
};

const getUrl: GetUrl = ({url, baseUrl}, params, query) => {
  const qs = getQueryString(query);
  const urlWithParams = getParameteriseUrl(url, params);
  const joinChar = /^\//.test(urlWithParams) || /\/$/.test(baseUrl) ? '' : '/';
  const absUrl = [baseUrl, urlWithParams].join(joinChar);

  return [absUrl, qs].filter(Boolean).join('?');
};

export {getUrl, getParameteriseUrl, getQueryString};
