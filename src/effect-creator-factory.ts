import xs, {Stream} from 'xstream';
import {IAction, IEffectCreator} from 'xstream-store';

import {IError, IResource} from './stream-creator-factory';
import {getUrl} from './utils';

export type Method = 'create' | 'find' | 'get' | 'patch' | 'remove' | 'update';

export interface IResourceResponseError {
  error: IError;
}
export type ResourceResponse = IResource | IResource[];

export interface ICreateEffectCreator {
  actions: {[key: string]: (...args: any[]) => IAction};
  actionTypes: {[key: string]: string};
  method: Method;
  options: {[key: string]: any};
}

const createEffectCreator: (obj: ICreateEffectCreator) => IEffectCreator = ({
  actionTypes,
  actions,
  method,
  options,
}) => {
  const actionType = actionTypes[method.toUpperCase()];
  const failureAction = actions[`${method.toLowerCase()}Failure`];
  const successAction = actions[`${method.toLowerCase()}Success`];
  const {provider, url: baseUrl} = options;

  const effectCreator: IEffectCreator = (select, dispatch) => {
    const response$ = select(actionType).map(action => {
      const url = getUrl(baseUrl, {id: action.id, ...action.params}, action.query);
      const requestConfig = options.configureRequest(method);

      return xs.from(provider(url, {method, ...requestConfig}));
    });
    const successResponse$: Stream<ResourceResponse> = response$
      .replaceError(_ => xs.empty())
      .filter(Boolean)
      .flatten();
    const failureResponse$: Stream<IResourceResponseError> = response$
      .filter(() => false)
      .replaceError(x => {
        if (typeof x.then === 'function') {
          return xs.from(x);
        } else {
          return xs.of(x);
        }
      })
      .map(res => ({error: res}));
    const mergedResponse$ = xs.merge(successResponse$, failureResponse$);

    const subscription = mergedResponse$.subscribe({
      next(res) {
        if ((res as IResourceResponseError).error) {
          dispatch(failureAction((res as IResourceResponseError).error));
        } else {
          dispatch(successAction(res));
        }
      },
    });

    return subscription;
  };

  return effectCreator;
};

export default createEffectCreator;
