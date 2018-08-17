import {ActionCreators} from './types/action-creators';

const getActions = (actionTypes: any): ActionCreators => ({
  reset: () => ({
    type: actionTypes.RESET,
  }),

  create: (data, params, extra) => ({
    ...extra,
    data,
    params,
    type: actionTypes.CREATE,
  }),

  createSuccess: entity => ({
    entity,
    type: actionTypes.CREATE_SUCCESS,
  }),

  createFailure: lastError => ({
    lastError,
    type: actionTypes.CREATE_FAILURE,
  }),

  find: (params, extra) => ({
    ...extra,
    params,
    type: actionTypes.FIND,
  }),

  findSuccess: items => ({
    items,
    type: actionTypes.FIND_SUCCESS,
  }),

  findFailure: lastError => ({
    lastError,
    type: actionTypes.FIND_FAILURE,
  }),

  get: (id, params, extra) => ({
    ...extra,
    id,
    params,
    type: actionTypes.GET,
  }),

  getSuccess: entity => ({
    entity,
    type: actionTypes.GET_SUCCESS,
  }),

  getFailure: lastError => ({
    lastError,
    type: actionTypes.GET_FAILURE,
  }),

  patch: (id, data, params, extra) => ({
    ...extra,
    data,
    id,
    params,
    type: actionTypes.PATCH,
  }),

  patchSuccess: entity => ({
    entity,
    type: actionTypes.PATCH_SUCCESS,
  }),

  patchFailure: lastError => ({
    lastError,
    type: actionTypes.PATCH_FAILURE,
  }),

  update: (id, data, params, extra) => ({
    ...extra,
    data,
    id,
    params,
    type: actionTypes.UPDATE,
  }),

  updateSuccess: entity => ({
    entity,
    type: actionTypes.UPDATE_SUCCESS,
  }),

  updateFailure: lastError => ({
    lastError,
    type: actionTypes.UPDATE_FAILURE,
  }),

  remove: (id, data, params, extra) => ({
    ...extra,
    data,
    id,
    params,
    type: actionTypes.REMOVE,
  }),

  removeSuccess: entity => ({
    entity,
    type: actionTypes.REMOVE_SUCCESS,
  }),

  removeFailure: lastError => ({
    lastError,
    type: actionTypes.REMOVE_FAILURE,
  }),
});

export default getActions;
