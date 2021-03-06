import {ActionType, EffectCreator} from 'xstream-store';

import {ActionCreators} from './action-creators';
import {CreateResourceConfig} from './create-resource';
import {Error, Resource} from './stream-creator-factory';

export enum Effect {
  Create = 'create',
  Find = 'find',
  Get = 'get',
  Patch = 'patch',
  Remove = 'remove',
  Update = 'update',
}

export interface ResourceResponseError {
  error: Error;
}
export type ResourceResponse = Resource | Resource[];

export interface CreateEffectCreator {
  actions: ActionCreators;
  actionTypes: {[key: string]: ActionType};
  config: CreateResourceConfig;
  effect: Effect;
}

export type CustomEffectCreator = (
  actionTypes: {[key: string]: ActionType},
  actions: any,
) => EffectCreator;
