import xs, {Stream} from 'xstream';
import {IEffectCreator} from 'xstream-store';

import {getUrl} from './utils';

import {ActionCreators} from './types/action-creators';
import {CreateResourceConfig} from './types/create-resource';
import {
  CreateEffectCreator,
  ResourceResponseError,
  ResourceResponse,
} from './types/effect-creator-factory';
import {Error, Resource} from './types/stream-creator-factory';

const effectMethodMap = {
  create: 'POST',
  find: 'GET',
  get: 'GET',
  patch: 'PATCH',
  remove: 'DELETE',
  update: 'PUT',
};

const createEffectCreator: (obj: CreateEffectCreator) => IEffectCreator = ({
  actionTypes,
  actions,
  config,
  effect,
}) => {
  const actionType = actionTypes[effect.toUpperCase()];
  const effectName = effect.toLowerCase();
  const failureAction = actions[`${effectName}Failure`];
  const successAction = actions[`${effectName}Success`];
  const {provider, url, baseUrl} = config;

  const effectCreator: IEffectCreator = (select, dispatch) => {
    const response$ = select(actionType)
      .map(action => {
        const {data, id, params, query} = action;
        const requestUrl = getUrl({url, baseUrl}, {id, ...params}, query);
        const requestConfig = config.configureRequest(effect);

        return xs
          .from(provider(requestUrl, data, {method: effectMethodMap[effect], ...requestConfig}))
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
      next(res: Resource | ResourceResponseError) {
        if ((res as ResourceResponseError).error) {
          dispatch(failureAction((res as ResourceResponseError).error));
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
