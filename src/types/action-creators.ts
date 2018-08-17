import {IAction} from 'xstream-store';

import {Error, Resource} from './stream-creator-factory';

export type Id = string | number;
export interface ActionCreatorData {
  [key: string]: any;
}
export interface ActionCreatorParams {
  [key: string]: any;
}
export interface ActionCreatorExtra {
  query?: {[key: string]: any};
}

export type FailureActionCreator = (lastError: Error) => IAction;

export interface ActionCreators {
  reset: () => IAction;

  create: (
    data: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => IAction;
  createSuccess: (item?: Resource) => IAction;
  createFailure: FailureActionCreator;

  find: (params?: ActionCreatorParams, extra?: ActionCreatorExtra) => IAction;
  findSuccess: (items?: Resource[]) => IAction;
  findFailure: (lastError: Error) => IAction;

  get: (id?: Id, params?: ActionCreatorParams, extra?: ActionCreatorExtra) => IAction;
  getSuccess: (item?: Resource) => IAction;
  getFailure: FailureActionCreator;

  patch: (
    id: Id,
    data: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => IAction;
  patchSuccess: (item?: Resource) => IAction;
  patchFailure: FailureActionCreator;

  remove: (
    id: Id,
    data?: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => IAction;
  removeSuccess: (items: Resource) => IAction;
  removeFailure: FailureActionCreator;

  update: (
    id: Id,
    data: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => IAction;
  updateSuccess: (items: Resource) => IAction;
  updateFailure: FailureActionCreator;

  [key: string]: (...args: any[]) => IAction;
}
