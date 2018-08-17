import {EffectCreator, StreamCreator} from 'xstream-store';

import {ActionCreators} from './action-creators';
import {CustomEffectCreator, Effect} from './effect-creator-factory';
import {Provider} from './providers';

export interface CreateResourceConfig {
  baseUrl?: string;
  configureRequest?: (effect: Effect) => {[key: string]: any};
  customEffectCreators?: CustomEffectCreator[];
  effects?: Effect[];
  name: string;
  provider?: Provider;
  url: string;
}

export interface CreateResourceReturn {
  actions: any;
  actionTypes: {[key: string]: string};
  effectCreators: EffectCreator[];
  streamCreator: StreamCreator;
}

export type CreateResource = (options: CreateResourceConfig) => CreateResourceReturn;
