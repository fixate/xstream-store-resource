import {Provider} from './types/providers';

export const fetchProvider: Provider = (url: string, data, requestConfig: object) => {
  return fetch(url, {...requestConfig, body: JSON.stringify(data)}).then((res: any) => {
    if (!res.ok) {
      throw res.json();
    }

    return res.json();
  });
};
