import xs from 'xstream';
import {IAction, IScopedState, IStreamCreator} from 'xstream-store';

import {
  RequestEffect,
  RequestState,
  IError,
  IResource,
  IResourceState,
} from './types/stream-creator-factory';

const initialState: IResourceState = {
  entity: null,
  items: [],
  lastError: {},
  requestEffect: RequestEffect.Idle,
  requestState: RequestState.Idle,
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
            requestEffect: RequestEffect.Idle,
            requestState: RequestState.Failure,
          })),

        select(actionTypes.CREATE).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Creating,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.FIND).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Finding,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.GET).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Getting,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.PATCH).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Patching,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.REMOVE).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Removing,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.UPDATE).map(_ => (state: IScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Updating,
          requestState: RequestState.Requesting,
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
            requestEffect: RequestEffect.Idle,
            requestState: RequestState.Success,
          })),

        select(actionTypes.FIND_SUCCESS).map(action => (state: IScopedState) => ({
          ...state,
          items: action.items,
          requestEffect: RequestEffect.Idle,
          requestState: RequestState.Success,
        })),

        select(actionTypes.RESET).map(() => (_: any) => initialState),
      )
      .startWith(() => initialState);
};

export default createStreamCreator;
