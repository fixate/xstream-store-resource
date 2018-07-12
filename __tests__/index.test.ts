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
        .compose(buffer(xs.never()))
        .subscribe({
          next(rs: any) {
            const res = rs.slice(-1)[0];

            if (actionName === 'find') {
              expect(res.items).toBeTruthy();
              expect(res.entity).not.toBeTruthy();
            } else {
              expect(res.entity).toBeTruthy();
              expect(res.items).toHaveLength(0);
            }

            expect(res.requestState).toBe(RequestStates.SUCCESS);
            expect(res.requestMethod).toBe(RequestStates.IDLE);
          },
        });

      store.dispatch(resource.actions[actionName]());
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
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
    const config = {url: '/resource/:id/item/:foo', provider: jest.fn()};
    const resource = getResource(config);
    const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
    const mockFetchProvider = jest.fn();
    const params = {id: 1, foo: 'bar'};

    const sub = store.state$
      .map(({myResource}) => ({...myResource}))
      .last()
      .subscribe({
        next(res) {
          expect(config.provider).toHaveBeenCalledTimes(1);
          expect(config.provider.mock.calls[0][0]).toContain(params.id);
          expect(config.provider.mock.calls[0][0]).not.toContain(':id');
          expect(config.provider.mock.calls[0][0]).toContain(params.foo);
          expect(config.provider.mock.calls[0][0]).not.toContain(':foo');
          config.provider.mockReset();
        },
      });

    store.dispatch(resource.actions.get(params.id, {foo: params.foo}));
    store.state$.shamefullySendComplete();

    sub.unsubscribe();
  });

  test('-> handles find requests', () => {
    const config = {url: '/resource/:id/item/:foo', provider: jest.fn()};
    const resource = getResource(config);

    ['find'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const mockFetchProvider = jest.fn();
      const params = {id: 1, foo: 'bar'};

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res) {
            expect(config.provider).toHaveBeenCalledTimes(1);
            expect(config.provider.mock.calls[0][0]).toContain(params.id);
            expect(config.provider.mock.calls[0][0]).toContain(params.foo);
            config.provider.mockReset();
          },
        });

      store.dispatch(resource.actions[actionName](params));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> handles get requests', () => {
    const config = {url: '/resource/:id/item/:foo', provider: jest.fn()};
    const resource = getResource(config);

    ['get'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const mockFetchProvider = jest.fn();
      const params = {id: 1, foo: 'bar'};

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res) {
            expect(config.provider).toHaveBeenCalledTimes(1);
            config.provider.mockReset();
          },
        });

      store.dispatch(resource.actions[actionName](params.id, {foo: params.foo}));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> handles create requests', () => {
    const config = {url: '/resource/:id/item/:foo', provider: jest.fn()};
    const resource = getResource(config);

    ['create'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const mockFetchProvider = jest.fn();
      const params = {id: 1, foo: 'bar'};
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

      store.dispatch(resource.actions[actionName](data, {foo: params.foo}));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> handles patch, update, and remove requests', () => {
    const config = {url: '/resource/:id/item/:foo', provider: jest.fn()};
    const resource = getResource(config);

    ['patch', 'update', 'remove'].map(actionName => {
      const store = createStore({myResource: resource.streamCreator}, resource.effectCreators);
      const mockFetchProvider = jest.fn();
      const params = {id: 1, foo: 'bar'};
      const data = {email: 'test@example.com'};

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .last()
        .subscribe({
          next(res) {
            expect(config.provider).toHaveBeenCalledTimes(1);
            expect(config.provider.mock.calls[0][0]).toContain(params.id);
            expect(config.provider.mock.calls[0][0]).toContain(params.foo);
            expect(config.provider.mock.calls[0][1]).toBe(data);
            config.provider.mockReset();
          },
        });

      store.dispatch(resource.actions[actionName](params.id, data, {foo: params.foo}));
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> returns actions and action types', () => {
    const {actionTypes, actions} = createResource({name: 'my-service', url: 'fake'});

    expect(actionTypes).toMatchSnapshot();
    expect(actions).toMatchSnapshot();
  });

  test.skip('-> allows requests to be configured', () => {
    expect(false).toBe(true);
  });

  test.skip('-> handles failed requests', () => {
    expect(false).toBe(true);
  });
});
