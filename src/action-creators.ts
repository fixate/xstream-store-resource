import {IAction} from 'xstream-store';

import {IError, IResource} from './stream-creator-factory';

export interface ID {
  id: string | number;
}
export interface IData {
  data: {[key: string]: any};
}
export interface IParams {
  params: {[key: string]: any};
}
export interface IExtra {
  [key: string]: any;
}

const getActions = (actionTypes: any) => ({
  reset: (): IAction => ({
    type: actionTypes.RESET,
  }),

  find: (params?: IParams, extra?: IExtra): IAction => ({
    ...extra,
    params,
    type: actionTypes.FIND,
  }),

  findSuccess: (items: IResource[]): IAction => ({
    items,
    type: actionTypes.FIND_SUCCESS,
  }),

  findFailure: (lastError: IError): IAction => ({
    lastError,
    type: actionTypes.FIND_FAILURE,
  }),

  get: (id: ID, params?: IParams, extra?: IExtra): IAction => ({
    ...extra,
    id,
    params,
    type: actionTypes.GET,
  }),

  getSuccess: (entity: IResource): IAction => ({
    entity,
    type: actionTypes.GET_SUCCESS,
  }),

  getFailure: (lastError: IError): IAction => ({
    lastError,
    type: actionTypes.GET_FAILURE,
  }),

  create: (data: IData, params: IParams, extra: IExtra): IAction => ({
    ...extra,
    data,
    params,
    type: actionTypes.CREATE,
  }),

  createSuccess: (entity: IResource): IAction => ({
    entity,
    type: actionTypes.CREATE_SUCCESS,
  }),

  createFailure: (lastError: IError): IAction => ({
    lastError,
    type: actionTypes.CREATE_FAILURE,
  }),

  patch: (id: ID, data: IData, params?: IParams): IAction => ({
    data,
    id,
    params,
    type: actionTypes.PATCH,
  }),

  patchSuccess: (entity: IResource): IAction => ({
    entity,
    type: actionTypes.PATCH_SUCCESS,
  }),

  patchFailure: (lastError: IError): IAction => ({
    lastError,
    type: actionTypes.PATCH_FAILURE,
  }),

  update: (id: ID, data: IData, params?: IParams): IAction => ({
    data,
    id,
    params,
    type: actionTypes.UPDATE,
  }),

  updateSuccess: (entity: IResource): IAction => ({
    entity,
    type: actionTypes.UPDATE_SUCCESS,
  }),

  updateFailure: (lastError: IError): IAction => ({
    lastError,
    type: actionTypes.UPDATE_FAILURE,
  }),

  remove: (id: ID, data: IData, params?: IParams): IAction => ({
    data,
    id,
    params,
    type: actionTypes.REMOVE,
  }),

  removeSuccess: (entity: IResource): IAction => ({
    entity,
    type: actionTypes.REMOVE_SUCCESS,
  }),

  removeFailure: (lastError: IError): IAction => ({
    lastError,
    type: actionTypes.REMOVE_FAILURE,
  }),
});

export default getActions;
