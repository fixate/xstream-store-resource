import xs from 'xstream';
import buffer from 'xstream/extra/buffer';
import createStore from 'xstream-store';

import {RequestMethods, RequestStates} from '../src/stream-creator-factory';
import createResource from '../src/index';

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
    const store = createStore({myResource: resource.streamCreator});

    ['create', 'find', 'get', 'patch', 'update', 'remove'].map(actionName => {
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
    const store = createStore({myResource: resource.streamCreator}, [...resource.effectCreators]);

    ['create', 'find', 'get', 'patch', 'update', 'remove'].map(actionName => {
      const response = {someProp: actionName};
      const spy = jest.spyOn(resource.actions, `${actionName}Success`);
      fetch.mockResponse(JSON.stringify(response));

      const sub = store.state$
        .map(({myResource}) => ({...myResource}))
        .compose(buffer(xs.never()))
        .subscribe({
          next(res: any) {
            if (actionName === 'find') {
              expect(res.items).toContain(response);
            } else {
              expect(res.entity).toBe(response);
            }

            expect(res.requestState).toBe(RequestStates.SUCCESS);
            expect(res.requestMethod).toBe(RequestStates.IDLE);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(response);
          },
        });

      store.dispatch(resource.actions[actionName]());
      store.state$.shamefullySendComplete();

      sub.unsubscribe();
    });
  });

  test('-> handles endpoints with multiple parameters', () => {
    expect(false).toBe(true);
  });

  test('-> accepts a stream creator that extends the resources stream', () => {
    expect(false).toBe(true);
  });

  test('-> returns actions and action types', () => {
    const {actionTypes, actions} = createResource({name: 'my-service', url: 'fake'});

    expect(actionTypes).toMatchSnapshot();
    expect(actions).toMatchSnapshot();
  });
});
