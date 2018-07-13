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
import {Effects} from './types/effect-creator-factory';

const createResource: CreateResource = options => {
  if (!options.name || !options.url) {
    throw new Error('name and url is required for createResource options');
  }

  const config: ICreateResourceConfig = {
    configureRequest: (effect: Effects) => ({}),
    customEffectCreators: [],
    effects: [
      Effects.create,
      Effects.find,
      Effects.get,
      Effects.patch,
      Effects.remove,
      Effects.update,
    ],
    provider: fetchProvider,
    ...options,
  };

  const actionTypes = createActionTypes(config.name);
  const actions = getActions(actionTypes);
  const streamCreator = createStreamCreator(actionTypes);
  const effectCreators = config.effects
    .filter(effect => !!Effects[effect])
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
