import {IAction} from 'xstream-store';

import {IActionCreators} from './action-creators';
import {ICreateResourceConfig} from './create-resource';
import {IError, IResource} from './stream-creator-factory';

export type Method = 'create' | 'find' | 'get' | 'patch' | 'remove' | 'update';

export interface IResourceResponseError {
  error: IError;
}
export type ResourceResponse = IResource | IResource[];

export interface ICreateEffectCreator {
  actions: IActionCreators;
  actionTypes: {[key: string]: string};
  method: Method;
  config: ICreateResourceConfig;
}
