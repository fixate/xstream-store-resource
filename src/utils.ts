const getQueryString = (query: {[key: string]: any} = {}) =>
  Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

const getParameteriseUrl = (url: string, params: {[key: string]: any} = {}) =>
  url
    .split('/')
    .map(part => {
      const isParam = /^:/.test(part);
      const param = part.replace(':', '');
      const value = params[param];

      return isParam && value ? encodeURIComponent(value) : part;
    })
    .join('/');

const getUrl = (url: string, params: {[key: string]: any}, query: {[key: string]: any}) => {
  const qs = getQueryString(query);
  const urlWithParams = getParameteriseUrl(url, params);

  return [urlWithParams, qs].filter(Boolean).join('?');
};

export {getUrl, getParameteriseUrl, getQueryString};
