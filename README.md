# xstream-store-resource

[![Build Status](https://travis-ci.org/fixate/xstream-store-resource.svg?branch=master)](https://travis-ci.org/fixate/xstream-store-resource)
[![npm version](https://badge.fury.io/js/xstream-store-resource.svg)](https://badge.fury.io/js/xstream-store-resource)
[![codecov](https://codecov.io/gh/fixate/xstream-store-resource/branch/master/graph/badge.svg)](https://codecov.io/gh/fixate/xstream-store-resource)

A module for removing the repetitive work in configuring asynchronous requests in [xstream-store](https://github.com/fixate/xstream-store).

## Installation

`xstream-store-resource` has `xstream` and `xstream-store` as peer dependencies.

```bash
$ npm i xstream xstream-store xstream-store-resource
```

## Example

```js
import createResource from 'xstream-store-resource';

const config = {
  // create, find, get, patch, remove, update
  effects: ['create', 'get'],
  name: 'users',
  url: '/api/users',
};

const {actions, actionTypes, streamCreator, effectCreators} = createResource(config);

const actions = {...xs, ...ats};

export {actions, effectCreators, streamCreator};
```

```js
// store.js
import createStore from 'xstream-store';

import {user$Creator, userEffectCreators} from './streams/user';

const streamCreators = {
  users: user$Creator,
};

const effectCreators = [
  ...userEffectCreators,
];

const store = createStore(streamCreators, effectCreators);

export default store;
```

```js
import store from './store';
import {actions as userActions} from './user-resource';

const subs = store.state$.subscribe({
  next({users}) {
    console.log(users)
  },
});

/* console.log: initial user state
{
  response: null,
  requestState: 'idle',
  requestEffect: 'idle',
  lastError: {},
}
*/

// get user with id '1'
store.dispatch(userActions.get('1')

/* console.log: user request made, response pending
{
  response: null,
  requestState: 'REQUESTING',
  requestEffect: 'GETTING',
  lastError: {},
}
*/

/* console.log: user response received
{
  response: {id: 1, name: 'Joe Soap', ...},
  requestState: 'SUCCESS',
  requestEffect: 'IDLE',
  lastError: {},
}
*/

// create a user
store.dispatch(userActions.create({username: 'someone@me.com', name: 'Jane Doe'})

/* console.log: user request made, response pending
{
  response: {...currUserDetails},
  requestState: 'REQUESTING',
  requestEffect: 'CREATING',
  lastError: {},
}
*/

/* console.log: user response received
{
  response: {id: 2, name: 'Jane Doe', ...},
  requestState: 'SUCCESS',
  requestEffect: 'IDLE',
  lastError: {},
}
*/
```

## Usage

### Config

`createResource` takes a single config object, and returns generated actions, action types, and a stream and effects creator that must be passed to an `xstream-store`.

```js
import createResource from 'xstream-store-resource';

// defaults
const config = {
  // required configs
  name: 'my-resource-name',
  url: '/my-resource-endpoint/:with/:params',

  // optional configs
  // base URL to append url config to, e.g. http://my-domain.com
  baseUrl: '',

  // custom effect creators you want subscribed to this state stream
  customEffectCreators: [],

  // types of requests to create subscriptions for
  effects: [
    'create', // POST a new entity
    'find',   // GET a list of resource entities
    'get',    // GET a single entity
    'patch',  // PATCH an entity
    'remove', // DELETE an entity
    'update'  // PUT an entity
  ],

  // How requests will be made, i.e. fetch, jQuery, axios, etc.
  // Uses a fetch provider by default
  provider: (requestUrl, data, config) => {...},

  // configure requests based on the effect, e.g. custom headers for POST
  requestConfig: (effect) => {},
};

// createResource returns the following object
const {
  // an object containing actions to dispatch for this resource
  actions,

  // The generated actionTypes used by the above actions
  // Useful if you want to create your own action creators to dispatch,
  // or if you are creating your own effect creators
  actionTypes,

  // the stream creator that must be passed to xstream-store's createStore
  streamCreator,

  // an array of effect creators that must be passed to xstream-store's createStore
  effectCreators,
} = createResource(config);
```

### Actions and Types of Actions

Similarly to Redux, `xstream-store` relies on dispatched actions to update the state stream. `xstream-store-resource` generates all the actions and action types necessary to make HTTP requests:

```js
import {actions, actionTypes} from './user-resource'

// the following action types can be used to filter other streams in the store
/*
actionTypes = {
  CREATE: '@users/create',
  CREATE_SUCCESS: '@user/createSuccess',
  CREATE_FAILURE: '@user/createFailure',

  FIND: '@users/find',
  FIND_SUCCESS: '@users/findSuccess',
  FIND_FAILURE: '@users/findFailure',

  GET: '@users/get',
  GET_SUCCESS: '@users/getSuccess',
  GET_FAILURE: '@users/getFailure',

  PATCH: '@users/patch',
  PATCH_SUCCESS: '@users/patchSuccess',
  PATCH_FAILURE: '@users/patchFailure',

  REMOVE: '@users/remove',
  REMOVE_SUCCESS: '@users/removeSuccess',
  REMOVE_FAILURE: '@users/removeFailure',

  UPDATE: '@users/update',
  UPDATE_SUCCESS: '@users/updateSuccess',
  UPDATE_FAILURE: '@users/updateFailure',
}
*/

// action creators that can be dispatched for your resource using store.dispatch
/*
const actions = {
  reset: () => {...},
  create: (data, params, extra) => {...},
  find: (params, extra) => {...},
  get: (id, params, extra) => {...},
  patch: (id, data, params, extra) => {...},
  update: (id, data, params, extra) => {...},
  remove: (id, data, params, extra) => {...},
});
*/
```

The above actions are the actions that are important as an end user, but a full list can be found in [src/action-creators.ts](./src/action-creators.ts).

#### Action Parameters

| Parameter | Description                                                                                                                                                                                                                                                    |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id       | appended to url  e.g. for the endpoint `/users`  `userActions.get(1)` will make a request for `/users/1`                                                                                                                                                       |
| data     | data sent as the payload of the request                                                                                                                                                                                                                        |
| params   | url parameters to replace.   e.g. for the endpoint `/articles/:articleId/comments`  `articleComments.get(1, {articleId: 2})` will make a request for `/articles/2/comments/1`                                                                                  |
| extra    | additional data to send with the request. Currently supports adding query parameters via the `query` property  e.g. for the endpoint `/users`  `userActions.get(1, {}, {query: {name: true; age: true})` will make a request for `/users/1?name=true&age=true` |

### Effects

Effects map to HTTP functions to make it easy to define what to do with a resource. The config allows only specific effects to be specified for a resource. Each effect requires its own subscription, it's best to specify in the config which effects to create subscriptions for.

Each effect's subscription updates the resource's state stream when a related action for that effect is dispatched.

When the `create`, `find`, `get`, `patch`, `remove`, and `update` action creators are dispatched, the resource will immediately be in a state indicating that a response is pending:

```js
// dispatch patch on a user
{
  response: {...userDetails},
  requestState: 'REQUESTING',
  requestEffect: 'PATCHING',
  lastError: {},
}
```

Once the request is resolved or rejected, the resource's state will be updated:

```js
// success
{
  response: {...userDetails},
  requestState: 'SUCCESS',
  requestEffect: 'IDLE',
  lastError: {},
}

// failure
{
  response: {...userDetails},
  requestState: 'FAILURE',
  requestEffect: 'IDLE',
  lastError: {message: 'request failed'},
}
```


## Todo

- [ ] document API
- [ ] examples
