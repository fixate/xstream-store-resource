import {CreateResourceConfig} from './create-resource';

export type GetUrlUrlArg = Pick<CreateResourceConfig, 'url' | 'baseUrl'>;

export type GetUrl = (
  {url, baseUrl}: GetUrlUrlArg,
  params: {[key: string]: any},
  query: {[key: string]: any},
) => string;
