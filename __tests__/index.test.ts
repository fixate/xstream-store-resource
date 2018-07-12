import xs from 'xstream';
import buffer from 'xstream/extra/buffer';
import createStore from 'xstream-store';

import {RequestMethods, RequestStates} from '../src/types/stream-creator-factory';
import createResource from '../src/index';
import * as providers from '../src/providers';

const getResource = (options = {}) => {
  const defaultOptions = {
    name: 'my-service',
    url: 'fakeurl',
  };

  return createResource({...defaultOptions, ...options});
};

describe('xstream-store-resource', () => {
  test('-> throws if initialised without required params', () => {
    expect(() => createResource({name: '', url: 'fakeurl'})).toThrow();
    expect(() => createResource({name: 'fakename', url: ''})).toThrow();
  });

  test('-> request state is properly set when requests are made', () => {
    const resource = getResource();

    ['create', 'find', 'get', 'patch', 'update', 'remove'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator});
      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res: any) {
            expect(res.requestState).toBe(RequestStates.REQUESTING);
            expect(res.requestMethod).not.toBe(RequestMethods.IDLE);
          },
        });

      store.dispatch(resource.actions[actionName]());
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> sets request state and methods on successful responses', () => {
    const resource = getResource();

    ['create', 'find', 'get', 'patch', 'update', 'remove'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, [...resource.effectCreators]);
      const response = {someProp: actionName};
      const spy = jest.spyOn(resource.actions, `${actionName}Success`);
      fetch.mockResponse(JSON.stringify(response));

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .drop(2)
        .subscribe({
          next(res: any) {
            if (actionName === 'find') {
              expect(res.items).toBeTruthy();
              expect(res.entity).not.toBeTruthy();
            } else {
              expect(res.entity).toBeTruthy();
              expect(res.items).toHaveLength(0);
            }

            expect(res.requestState).toBe(RequestStates.SUCCESS);
            expect(res.requestMethod).toBe(RequestStates.IDLE);

            store.state$.shamefullySendComplete();

            sub.unsubscribe();
          },
        });

      store.dispatch(resource.actions[actionName]());
      fetch.resetMocks();
    });
  });

  test('-> sets request state and methods on failed responses', () => {
    const resource = getResource();

    ['create', 'find', 'get', 'patch', 'update', 'remove'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, [...resource.effectCreators]);
      const error = {message: 'request failed'};
      const spy = jest.spyOn(resource.actions, `${actionName}Failure`);
      fetch.mockReject(JSON.stringify(error));

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .drop(2)
        .subscribe({
          next(res: any) {
            expect(res.lastError).toBe(error);

            expect(res.requestState).toBe(RequestStates.FAILURE);
            expect(res.requestMethod).toBe(RequestStates.IDLE);

            store.state$.shamefullySendComplete();

            sub.unsubscribe();
          },
        });

      store.dispatch(resource.actions[actionName]());
      fetch.resetMocks();
    });
  });

  test('-> handles endpoints with multiple parameters', () => {
    const config = {url: '/resource/:foo/item/:bar', provider: jest.fn()};
    const resource = getResource(config);
    const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
    const params = {foo: 1, bar: 'baz'};

    const sub = store.state$
      .map(({myResource}) => ({...myResource}))
      .last()
      .subscribe({
        next(res) {
          expect(config.provider).toHaveBeenCalledTimes(1);
          expect(config.provider.mock.calls[0][0]).toContain(params.foo);
          expect(config.provider.mock.calls[0][0]).not.toContain(':foo');
          expect(config.provider.mock.calls[0][0]).toContain(params.bar);
          expect(config.provider.mock.calls[0][0]).not.toContain(':bar');
          config.provider.mockReset();
        },
      });

    store.dispatch(resource.actions.get(null, params));
    store.state$.shamefullySendComplete();

    sub.unsubscribe();
  });

  test('-> handles find requests', () => {
    const config = {url: '/resource/:foo/item/:bar', provider: jest.fn()};
    const resource = getResource(config);

    ['find'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const params = {foo: 1, bar: 'baz'};

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res) {
            expect(config.provider).toHaveBeenCalledTimes(1);
            expect(config.provider.mock.calls[0][0]).toContain(params.foo);
            expect(config.provider.mock.calls[0][0]).toContain(params.bar);
            config.provider.mockReset();
          },
        });

      store.dispatch(resource.actions[actionName](params));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> handles get requests', () => {
    const config = {url: '/resource/:foo/item/:bar', provider: jest.fn()};
    const resource = getResource(config);

    ['get'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const params = {foo: 1, bar: 'baz'};

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res) {
            expect(config.provider).toHaveBeenCalledTimes(1);
            config.provider.mockReset();
          },
        });

      store.dispatch(resource.actions[actionName](null, params));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> handles create requests', () => {
    const config = {url: '/resource/:foo/item/:bar', provider: jest.fn()};
    const resource = getResource(config);

    ['create'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const params = {foo: 1, bar: 'baz'};
      const data = {email: 'test@example.com'};

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res) {
            expect(config.provider).toHaveBeenCalledTimes(1);
            expect(config.provider.mock.calls[0][1]).toBe(data);
            config.provider.mockReset();
          },
        });

      store.dispatch(resource.actions[actionName](data, params));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> handles patch, update, and remove requests', () => {
    const config = {url: '/resource/:foo/item/:bar', provider: jest.fn()};
    const resource = getResource(config);

    ['patch', 'update', 'remove'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const params = {foo: 1, bar: 'baz'};
      const data = {email: 'test@example.com'};

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res) {
            expect(config.provider).toHaveBeenCalledTimes(1);
            expect(config.provider.mock.calls[0][0]).toContain(params.foo);
            expect(config.provider.mock.calls[0][0]).toContain(params.bar);
            expect(config.provider.mock.calls[0][1]).toBe(data);
            config.provider.mockReset();
          },
        });

      store.dispatch(resource.actions[actionName](null, data, params));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> returns actions and action types', () => {
    const {actionTypes, actions} = createResource({name: 'my-service', url: 'fake'});

    expect(actionTypes).toMatchSnapshot();
    expect(actions).toMatchSnapshot();
  });

  test('-> appends id to urls if provided', () => {
    const config = {name: 'my-resource', url: '/api/resource', provider: jest.fn()};

    ['get', 'patch', 'update', 'remove'].map(method => {
      const id = 'foo';
      const {actionTypes, actions, effectCreators, streamCreator} = createResource(config);
      const store = createStore({myResource: streamCreator}, effectCreators);

      store.dispatch(actions[method](id));

      expect(config.provider.mock.calls[0][0].split('/').slice(-1)).toContain(id);

      config.provider.mockReset();
    });
  });

  test('-> custom effects have access to action types', () => {
    const spy = jest.fn();

    ['create', 'find', 'get', 'patch', 'remove', 'update'].map(method => {
      const effect = actionTypes => (select, dispatch) => {
	const sideEffect$ = select(actionTypes[method]);

	sideEffect$.subscribe({
	  next() {
	    spy(method);
	  },
	});
      };
      const config = {name: 'my-resource', url: '/api', customEffectCreators: [effect]};
      const {actions, effectCreators, streamCreator} = createResource(config);
      const store = createStore({myResource: streamCreator}, effectCreators);

      const subs = store.state$.last().subscribe({
	next() {
	  expect(spy).toHaveBeenCalledTimes(1);
	  expect(spy).toHaveBeenCalledWith(method);
	  spy.mockReset();
	},
      });

      store.dispatch(actions[method]());
      store.state$.shamefullySendComplete();

      subs.unsubscribe();
    });
  });

  test(`-> custom effects can dispatch a resource's actions`, () => {
    const spy = jest.fn();
    const externalAction = {type: 'foo'};

    ['create', 'find', 'get', 'patch', 'remove', 'update'].map(method => {
      const dispatchEffect = (actionTypes, actions) => (select, dispatch) => {
	const $ = select(externalAction);

	$.subscribe({
	  next() {
	    dispatch(actions[method]());
	  },
	});
      };
      const receiverEffect = (actionTypes, actions) => (select, dispatch) => {
	const $ = select(actionTypes[method]);

	$.subscribe({
	  next() {
	    spy(method);
	  },
	});
      };
      const config = {
	customEffectCreators: [dispatchEffect, receiverEffect],
	name: 'my-resource',
	url: '/api',
      };
      const {actions, effectCreators, streamCreator} = createResource(config);
      const store = createStore({myResource: streamCreator}, effectCreators);

      const subs = store.state$.last().subscribe({
	next() {
	  expect(spy).toHaveBeenCalledTimes(1);
	  expect(spy).toHaveBeenCalledWith(method);
	  spy.mockReset();
	},
      });

      store.dispatch(externalAction);
      store.state$.shamefullySendComplete();

      subs.unsubscribe();
    });
  });

  test('-> allows requests to be configured', () => {
    const requestConfig = {
      headers: {
	foo: 'bar',
      },
      'fake-prop': 'baz',
    };
    const config = {
      name: 'my-resource',
      url: '/api',
      provider: jest.fn(),
      configureRequest: jest.fn(method => ({...requestConfig})),
    };

    ['create', 'find', 'get', 'patch', 'update', 'remove'].map(method => {
      const {actionTypes, actions, effectCreators, streamCreator} = createResource(config);
      const store = createStore({myResource: streamCreator}, effectCreators);

      store.dispatch(actions[method]());

      Object.keys(requestConfig).map(key => {
	expect(config.provider.mock.calls[0][2]).toHaveProperty(key);
      });
      expect(config.configureRequest).toHaveBeenCalledWith(method);
    });

    config.provider.mockReset();
    config.configureRequest.mockReset();
  });
});
