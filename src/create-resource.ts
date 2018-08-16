import {IAction, IEffectCreator, IStreamCreator} from 'xstream-store';

import getActions from './action-creators';
import createActionTypes from './action-types';
import createEffectCreator from './effect-creator-factory';
import {fetchProvider} from './providers';
import createStreamCreator from './stream-creator-factory';

import {
  CreateEffectCreator,
  CreateResource,
  ICreateResourceConfig,
  ICreateResourceReturn,
} from './types/create-resource';
import {Effect} from './types/effect-creator-factory';

const createResource: CreateResource = options => {
  if (!options.name || !options.url) {
    throw new Error('name and url is required for createResource options');
  }

  const config: ICreateResourceConfig = {
    baseUrl: '',
    configureRequest: (effect: Effect) => ({}),
    customEffectCreators: [],
    effects: [Effect.Create, Effect.Find, Effect.Get, Effect.Patch, Effect.Remove, Effect.Update],
    provider: fetchProvider,
    ...options,
  };

  const actionTypes = createActionTypes(config.name);
  const actions = getActions(actionTypes);
  const streamCreator = createStreamCreator(actionTypes);
  const effectCreators = config.effects
    .filter(effect => !!Effect[effect])
    .map(effect => createEffectCreator({actionTypes, actions, effect, config}))
    .concat(config.customEffectCreators.map(effectCreator => effectCreator(actionTypes, actions)));

  return {
    actionTypes,
    actions,
    effectCreators,
    streamCreator,
  };
};

export default createResource;
