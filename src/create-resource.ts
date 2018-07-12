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
import {Method} from './types/effect-creator-factory';

const createResource: CreateResource = options => {
  if (!options.name || !options.url) {
    throw new Error('name and url is required for createResource options');
  }

  const config: ICreateResourceConfig = {
    configureRequest: (method: Method) => ({}),
    customEffectCreators: [],
    methods: ['create', 'find', 'get', 'patch', 'remove', 'update'],
    provider: fetchProvider,
    ...options,
  };

  const actionTypes = createActionTypes(config.name);
  const actions = getActions(actionTypes);
  const streamCreator = createStreamCreator(actionTypes);
  const effectCreators = config.methods
    .map(method => createEffectCreator({actionTypes, actions, method, config}))
    .concat(config.customEffectCreators.map(effectCreator => effectCreator(actionTypes, actions)));

  return {
    actionTypes,
    actions,
    effectCreators,
    streamCreator,
  };
};

export default createResource;
