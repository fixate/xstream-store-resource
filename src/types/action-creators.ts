import {Action} from 'xstream-store';

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

export type FailureActionCreator = (lastError: Error) => Action;

export interface ActionCreators {
  reset: () => Action;

  create: (
    data: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => Action;
  createSuccess: (response?: Resource) => Action;
  createFailure: FailureActionCreator;

  find: (params?: ActionCreatorParams, extra?: ActionCreatorExtra) => Action;
  findSuccess: (response?: Resource) => Action;
  findFailure: (lastError: Error) => Action;

  get: (id?: Id, params?: ActionCreatorParams, extra?: ActionCreatorExtra) => Action;
  getSuccess: (response?: Resource) => Action;
  getFailure: FailureActionCreator;

  patch: (
    id: Id,
    data: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => Action;
  patchSuccess: (response?: Resource) => Action;
  patchFailure: FailureActionCreator;

  remove: (
    id: Id,
    data?: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => Action;
  removeSuccess: (response: Resource) => Action;
  removeFailure: FailureActionCreator;

  update: (
    id: Id,
    data: ActionCreatorData,
    params?: ActionCreatorParams,
    extra?: ActionCreatorExtra,
  ) => Action;
  updateSuccess: (response: Resource) => Action;
  updateFailure: FailureActionCreator;

  [key: string]: (...args: any[]) => Action;
}
