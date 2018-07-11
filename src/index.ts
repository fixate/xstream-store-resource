import {IAction, IEffectCreator, IStreamCreator} from 'xstream-store';

import getActions from './action-creators';
import createActionTypes from './action-types';
import createEffectCreator, {Method} from './effect-creator-factory';
import {fetchProvider, Provider} from './providers';
import createStreamCreator from './stream-creator-factory';

export type CreateEffectCreator = (actionTypes: any) => IEffectCreator;

export interface ICreateResourceConfig {
  configureRequest?: (x: Method) => {[key: string]: any};
  customEffectCreators?: CreateEffectCreator[];
  methods?: Method[];
  name: string;
  provider?: Provider;
  url: string;
  [key: string]: any;
}

export interface ICreateResourceReturn {
  actions: any;
  actionTypes: {[key: string]: string};
  streamCreator: IStreamCreator;
  effectCreators: IEffectCreator[];
}

export type CreateResource = (options: ICreateResourceConfig) => ICreateResourceReturn;
const createResource: CreateResource = options => {
  if (!options.name || !options.url) {
    throw new Error('name and url is required for createResource options');
  }

  const config: ICreateResourceConfig = {
    configureRequest: (method: Method) => ({method}),
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
    .concat(config.customEffectCreators.map(effectCreator => effectCreator(actionTypes)));

  return {
    actionTypes,
    actions,
    effectCreators,
    streamCreator,
  };
};

export default createResource;
