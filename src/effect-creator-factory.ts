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

const methodToHttp = {
  create: 'POST',
  find: 'GET',
  get: 'GET',
  patch: 'PATCH',
  remove: 'DELETE',
  update: 'PUT',
};

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
    const response$ = select(actionType)
      .map(action => {
        const {data, id, params, query} = action;
        const url = getUrl(baseUrl, {id, ...params}, query);
        const requestConfig = config.configureRequest(method);

        return xs
          .from(provider(url, data, {method: methodToHttp[method], ...requestConfig}))
          .replaceError(err => {
            if (typeof err.then === 'function') {
              return xs.from(err).map(x => ({error: x}));
            } else {
              return xs.of({error: err});
            }
          });
      })
      .flatten();

    const subscription = response$.subscribe({
      next(res: IResource | IResourceResponseError) {
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
