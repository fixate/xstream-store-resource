import {IAction} from 'xstream-store';

import {IActionCreators} from './action-creators';
import {ICreateResourceConfig} from './create-resource';
import {IError, IResource} from './stream-creator-factory';

export enum Effect {
  Create = 'create',
  Find = 'find',
  Get = 'get',
  Patch = 'patch',
  Remove = 'remove',
  Update = 'update',
}

export interface IResourceResponseError {
  error: IError;
}
export type ResourceResponse = IResource | IResource[];

export interface ICreateEffectCreator {
  actions: IActionCreators;
  actionTypes: {[key: string]: string};
  config: ICreateResourceConfig;
  effect: Effect;
}
