import {IAction, IEffectCreator, IStreamCreator} from 'xstream-store';

import {ActionCreators} from './action-creators';
import {CreateEffectCreator, Effect} from './effect-creator-factory';
import {Provider} from './providers';

export interface CreateResourceConfig {
  baseUrl?: string;
  configureRequest?: (effect: Effect) => {[key: string]: any};
  customEffectCreators?: CreateEffectCreator[];
  effects?: Effect[];
  name: string;
  provider?: Provider;
  url: string;
}

export interface CreateResourceReturn {
  actions: any;
  actionTypes: {[key: string]: string};
  effectCreators: IEffectCreator[];
  streamCreator: IStreamCreator;
}

export type CreateResource = (options: CreateResourceConfig) => CreateResourceReturn;
