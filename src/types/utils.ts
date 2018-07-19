import {ICreateResourceConfig} from './create-resource';

export type GetUrlUrlArg = Pick<ICreateResourceConfig, 'url' | 'baseUrl'>;

export type GetUrl = (
  {url, baseUrl}: GetUrlUrlArg,
  params: {[key: string]: any},
  query: {[key: string]: any},
) => string;
