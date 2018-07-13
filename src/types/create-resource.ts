import {IAction, IEffectCreator, IStreamCreator} from 'xstream-store';

import {IActionCreators} from './action-creators';
import {Effect} from './effect-creator-factory';
import {Provider} from './providers';

export type CreateEffectCreator = (actionTypes: any, actions: IActionCreators) => IEffectCreator;

export interface ICreateResourceConfig {
  configureRequest?: (effect: Effect) => {[key: string]: any};
  customEffectCreators?: CreateEffectCreator[];
  effects?: Effect[];
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
