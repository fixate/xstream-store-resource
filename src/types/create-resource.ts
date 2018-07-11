import {IAction, IEffectCreator, IStreamCreator} from 'xstream-store';

import {Method} from './effect-creator-factory';
import {Provider} from './providers';

export type CreateEffectCreator = (actionTypes: any) => IEffectCreator;

export interface ICreateResourceConfig {
  configureRequest?: (x: Method) => {[key: string]: any};
  customEffectCreators?: CreateEffectCreator[];
  methods?: Method[];
  name: string;
  provider?: Provider;
  url: string;
  [key: string]: any;
}

export interface ICreateResourceReturn {
  actions: any;
  actionTypes: {[key: string]: string};
  streamCreator: IStreamCreator;
  effectCreators: IEffectCreator[];
}

export type CreateResource = (options: ICreateResourceConfig) => ICreateResourceReturn;
