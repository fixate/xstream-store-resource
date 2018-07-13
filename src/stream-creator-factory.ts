import xs from 'xstream';
import {IAction, IScopedState, IStreamCreator} from 'xstream-store';

import {
  RequestEffects,
  RequestStates,
  IError,
  IResource,
  IResourceState,
} from './types/stream-creator-factory';

const initialState: IResourceState = {
  entity: null,
  items: [],
  lastError: {},
  requestEffect: RequestEffects.IDLE,
  requestState: RequestStates.IDLE,
};

const createStreamCreator: (actionTs: {[key: string]: string}) => IStreamCreator = actionTypes => {
  return select =>
    xs
      .merge(
        xs
          .merge(
            select(actionTypes.CREATE_FAILURE),
            select(actionTypes.FIND_FAILURE),
            select(actionTypes.GET_FAILURE),
            select(actionTypes.PATCH_FAILURE),
            select(actionTypes.REMOVE_FAILURE),
            select(actionTypes.UPDATE_FAILURE),
          )
          .map(action => (state: IScopedState) => ({
            ...state,
            lastError: action.lastError,
            requestEffect: RequestEffects.IDLE,
            requestState: RequestStates.FAILURE,
          })),

        select(actionTypes.CREATE).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffects.CREATING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.FIND).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffects.FINDING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.GET).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffects.GETTING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.PATCH).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffects.PATCHING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.REMOVE).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffects.REMOVING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.UPDATE).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffects.UPDATING,
          requestState: RequestStates.REQUESTING,
        })),

        xs
          .merge(
            select(actionTypes.CREATE_SUCCESS),
            select(actionTypes.GET_SUCCESS),
            select(actionTypes.PATCH_SUCCESS),
            select(actionTypes.REMOVE_SUCCESS),
            select(actionTypes.UPDATE_SUCCESS),
          )
          .map(action => (state: IScopedState) => ({
            ...state,
            entity: action.entity,
            requestEffect: RequestEffects.IDLE,
            requestState: RequestStates.SUCCESS,
          })),

        select(actionTypes.FIND_SUCCESS).map(action => (state: IScopedState) => ({
          ...state,
          items: action.items,
          requestEffect: RequestEffects.IDLE,
          requestState: RequestStates.SUCCESS,
        })),

        select(actionTypes.RESET).map(() => (_: any) => initialState),
      )
      .startWith(() => initialState);
};

export default createStreamCreator;
