import xs, {Stream} from 'xstream';
import {IAction, IEffectCreator} from 'xstream-store';

import {getUrl} from './utils';

import {ICreateResourceConfig} from './types/create-resource';
import {
  ICreateEffectCreator,
  IResourceResponseError,
  Method,
  ResourceResponse,
} from './types/effect-creator-factory';
import {IError, IResource} from './types/stream-creator-factory';

const createEffectCreator: (obj: ICreateEffectCreator) => IEffectCreator = ({
  actionTypes,
  actions,
  method,
  config,
}) => {
  const actionType = actionTypes[method.toUpperCase()];
  const failureAction = actions[`${method.toLowerCase()}Failure`];
  const successAction = actions[`${method.toLowerCase()}Success`];
  const {provider, url: baseUrl} = config;

  const effectCreator: IEffectCreator = (select, dispatch) => {
    const response$ = select(actionType).map(action => {
      const {data, id, params, query} = action;
      const url = getUrl(baseUrl, {id, ...params}, query);
      const requestConfig = config.configureRequest(method);

      return xs.from(provider(url, data, {method, ...requestConfig}));
    });
    const successResponse$: Stream<ResourceResponse> = response$
      .replaceError(_ => xs.empty())
      .filter(Boolean);
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
