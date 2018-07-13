import {IAction, IEffectCreator, IStreamCreator} from 'xstream-store';

import {IActionCreators} from './action-creators';
import {Effects} from './effect-creator-factory';
import {Provider} from './providers';

export type CreateEffectCreator = (actionTypes: any, actions: IActionCreators) => IEffectCreator;

export interface ICreateResourceConfig {
  configureRequest?: (effect: Effects) => {[key: string]: any};
  customEffectCreators?: CreateEffectCreator[];
  effects?: Effects[];
  name: string;
  provider?: Provider;
  url: string;
}

export interface ICreateResourceReturn {
  actions: any;
  actionTypes: {[key: string]: string};
  streamCreator: IStreamCreator;
  effectCreators: IEffectCreator[];
}

export type CreateResource = (options: ICreateResourceConfig) => ICreateResourceReturn;
