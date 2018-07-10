const fetchProvider = (url: string, requestConfig: object) => {
  return fetch(url, requestConfig).then((res: any) => {
    if (!res.ok) {
      throw res.json();
    }

    return res.json();
  });
};

export {fetchProvider};
