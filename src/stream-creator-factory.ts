import xs from 'xstream';
import {ScopedState, StreamCreator} from 'xstream-store';

import {Error, RequestEffect, RequestState, ResourceState} from './types/stream-creator-factory';

const initialState: ResourceState = {
  response: null,
  lastError: {},
  requestEffect: RequestEffect.Idle,
  requestState: RequestState.Idle,
};

const createStreamCreator: (actionTs: {[key: string]: string}) => StreamCreator = actionTypes => {
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
          .map(action => (state: ScopedState) => ({
            ...state,
            lastError: action.lastError,
            requestEffect: RequestEffect.Idle,
            requestState: RequestState.Failure,
          })),

        select(actionTypes.CREATE).map(_ => (state: ScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Creating,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.FIND).map(_ => (state: ScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Finding,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.GET).map(_ => (state: ScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Getting,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.PATCH).map(_ => (state: ScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Patching,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.REMOVE).map(_ => (state: ScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Removing,
          requestState: RequestState.Requesting,
        })),

        select(actionTypes.UPDATE).map(_ => (state: ScopedState) => ({
          ...state,
          requestEffect: RequestEffect.Updating,
          requestState: RequestState.Requesting,
        })),

        xs
          .merge(
            select(actionTypes.CREATE_SUCCESS),
            select(actionTypes.FIND_SUCCESS),
            select(actionTypes.GET_SUCCESS),
            select(actionTypes.PATCH_SUCCESS),
            select(actionTypes.REMOVE_SUCCESS),
            select(actionTypes.UPDATE_SUCCESS),
          )
          .map(action => (state: ScopedState) => ({
            ...state,
            response: action.response,
            requestEffect: RequestEffect.Idle,
            requestState: RequestState.Success,
          })),

        select(actionTypes.RESET).map(() => (_: any) => initialState),
      )
      .startWith(() => initialState);
};

export default createStreamCreator;
