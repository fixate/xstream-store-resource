import {IAction} from 'xstream-store';

import {IError, IResource} from './stream-creator-factory';

export interface ID {
  id: string | number;
}
export interface IData {
  [key: string]: any;
}
export interface IExtra {
  query?: {[key: string]: any};
}
export interface IParams {
  [key: string]: any;
}

export type FailureActionCreator = (lastError: IError) => IAction;

export interface IActionCreators {
  reset: () => IAction;

  create: (data: IData, params?: IParams, extra?: IExtra) => IAction;
  createSuccess: (item?: IResource) => IAction;
  createFailure: FailureActionCreator;

  find: (params?: IParams, extra?: IExtra) => IAction;
  findSuccess: (items?: IResource[]) => IAction;
  findFailure: (lastError: IError) => IAction;

  get: (id: ID, params?: IParams, extra?: IExtra) => IAction;
  getSuccess: (item?: IResource) => IAction;
  getFailure: FailureActionCreator;

  patch: (id: ID, data: IData, params?: IParams, extra?: IExtra) => IAction;
  patchSuccess: (item?: IResource) => IAction;
  patchFailure: FailureActionCreator;

  remove: (id: ID, data: IData, params?: IParams, extra?: IExtra) => IAction;
  removeSuccess: (items: IResource) => IAction;
  removeFailure: FailureActionCreator;

  update: (id: ID, data: IData, params?: IParams, extra?: IExtra) => IAction;
  updateSuccess: (items: IResource) => IAction;
  updateFailure: FailureActionCreator;

  [key: string]: (...args: any[]) => IAction;
}
