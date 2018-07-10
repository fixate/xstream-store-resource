import {IAction, IEffectCreator, IStreamCreator} from 'xstream-store';

import createActionTypes from './action-types';
import getActions from './action-creators';
import createEffectCreator, {Method} from './effect-creator-factory';
import {fetchProvider} from './providers';
import createStreamCreator from './stream-creator-factory';

export interface ICreateResourceOptions {
  configureRequest: (x: Method) => {[key: string]: any};
  customEffectCreators: [(actionTypes: any) => IEffectCreator];
  methods?: Method[];
  name: string;
  url: string;
  [key: string]: any;
}

export interface ICreateResourceReturn {
  actions: any;
  actionTypes: {[key: string]: string};
  streamCreator: IStreamCreator;
}

export type CreateResource = (baseOpts: ICreateResourceOptions) => ICreateResourceReturn;
const createResource: CreateResource = baseOpts => {
  if (!baseOpts.name || !baseOpts.url) {
    throw new Error('name and url is required for createResource');
  }

  const options: ICreateResourceOptions = {
    configureRequest: (method: Method) => ({method}),
    provider: fetchProvider,
    methods: ['create', 'find', 'get', 'patch', 'remove', 'update'],
    customEffectCreators: [],
    ...baseOpts,
  };

  const actionTypes = createActionTypes(options.name);
  const actions = getActions(actionTypes);
  const streamCreator = createStreamCreator(actionTypes);
  const effectCreators = options.methods
    .map(method => createEffectCreator({actionTypes, actions, method, options}))
    .concat(options.customEffectCreators.map(effectCreator => effectCreator(actionTypes)));

  return {
    actions,
    actionTypes,
    effectCreators,
    streamCreator,
  };
};

export default createResource;
