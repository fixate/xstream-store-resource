import xs from 'xstream';
import {IAction, IScopedState, IStreamCreator} from 'xstream-store';

export enum RequestStates {
  IDLE,
  REQUESTING,
  SUCCESS,
  FAILURE,
}

export enum RequestMethods {
  IDLE,
  GETTING,
  FINDING,
  CREATING,
  PATCHING,
  UPDATING,
  REMOVING,
}

export interface IResource {
  [key: string]: any;
}
export interface IError {
  [key: string]: any;
}
export interface IResourceState {
  entity: IResource | null;
  items: IResource[];
  lastError: IError;
  requestMethod: RequestMethods;
  requestState: RequestStates;
}

const initialState: IResourceState = {
  entity: null,
  items: [],
  lastError: {},
  requestMethod: RequestMethods.IDLE,
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
            requestMethod: RequestMethods.IDLE,
            requestState: RequestStates.FAILURE,
          })),

        select(actionTypes.CREATE).map(_ => (state: IScopedState) => ({
          ...state,
          requestMethod: RequestMethods.CREATING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.FIND).map(_ => (state: IScopedState) => ({
          ...state,
          requestMethod: RequestMethods.FINDING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.GET).map(_ => (state: IScopedState) => ({
          ...state,
          requestMethod: RequestMethods.GETTING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.PATCH).map(_ => (state: IScopedState) => ({
          ...state,
          requestMethod: RequestMethods.PATCHING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.REMOVE).map(_ => (state: IScopedState) => ({
          ...state,
          requestMethod: RequestMethods.REMOVING,
          requestState: RequestStates.REQUESTING,
        })),

        select(actionTypes.UPDATE).map(_ => (state: IScopedState) => ({
          ...state,
          requestMethod: RequestMethods.UPDATING,
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
            requestMethod: RequestMethods.IDLE,
            requestState: RequestStates.SUCCESS,
          })),

        select(actionTypes.FIND_SUCCESS).map(action => (state: IScopedState) => ({
          ...state,
          items: action.items,
          requestMethod: RequestMethods.IDLE,
          requestState: RequestStates.SUCCESS,
        })),

        select(actionTypes.RESET).map(() => (_: any) => initialState),
      )
      .startWith(() => initialState);
};

export default createStreamCreator;
