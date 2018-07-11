import {IAction} from 'xstream-store';

import {ICreateResourceConfig} from './create-resource';
import {IError, IResource} from './stream-creator-factory';

export type Method = 'create' | 'find' | 'get' | 'patch' | 'remove' | 'update';

export interface IResourceResponseError {
  error: IError;
}
export type ResourceResponse = IResource | IResource[];

export interface ICreateEffectCreator {
  actions: {[key: string]: (...args: any[]) => IAction};
  actionTypes: {[key: string]: string};
  method: Method;
  config: ICreateResourceConfig;
}
