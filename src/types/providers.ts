export type Provider = (
  url: string,
  data: {[key: string]: any},
  requestConfig: {[key: string]: any},
) => Promise<Response>;
