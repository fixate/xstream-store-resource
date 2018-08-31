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

  createSuccess: response => ({
    response,
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

  findSuccess: response => ({
    response,
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

  getSuccess: response => ({
    response,
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

  patchSuccess: response => ({
    response,
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

  updateSuccess: response => ({
    response,
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

  removeSuccess: response => ({
    response,
    type: actionTypes.REMOVE_SUCCESS,
  }),

  removeFailure: lastError => ({
    lastError,
    type: actionTypes.REMOVE_FAILURE,
  }),
});

export default getActions;
