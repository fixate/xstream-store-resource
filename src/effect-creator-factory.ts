import xs, {Stream} from 'xstream';
import {IAction, IEffectCreator} from 'xstream-store';

import {getUrl} from './utils';

import {IActionCreators} from './types/action-creators';
import {ICreateResourceConfig} from './types/create-resource';
import {
  Effect,
  ICreateEffectCreator,
  IResourceResponseError,
  ResourceResponse,
} from './types/effect-creator-factory';
import {IError, IResource} from './types/stream-creator-factory';

const effectMethodMap = {
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
  config,
  effect,
}) => {
  const actionType = actionTypes[effect.toUpperCase()];
  const effectName = effect.toLowerCase();
  const failureAction = actions[`${effectName}Failure`];
  const successAction = actions[`${effectName}Success`];
  const {provider, url: baseUrl} = config;

  const effectCreator: IEffectCreator = (select, dispatch) => {
    const response$ = select(actionType)
      .map(action => {
        const {data, id, params, query} = action;
        const url = getUrl(baseUrl, {id, ...params}, query);
        const requestConfig = config.configureRequest(effect);

        return xs
          .from(provider(url, data, {method: effectMethodMap[effect], ...requestConfig}))
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
