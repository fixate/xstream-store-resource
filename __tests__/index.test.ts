import createActionTypes from '../src/action-types';
import createResource from '../src/index';

describe('xstream-store-resource', () => {
  test('-> throws if initialised without name', () => {
    expect(() => createResource({name: '', url: 'fakeurl'})).toThrow();
  });

  test('-> throws if initialised without url', () => {
    expect(() => createResource({name: 'fakename', url: ''})).toThrow();
  });

  test('-> configures request, success, and failure actions', () => {
    expect(false).toBe(true);
  });

  test('-> dispatches actions when services respond', () => {
    expect(false).toBe(true);
  });

  test('-> handles endpoints with multiple parameters', () => {
    expect(false).toBe(true);
  });

  test('-> accepts a stream creator that extends the resources stream', () => {
    expect(false).toBe(true);
  });

  test('-> returns action types that can be subscribed to', () => {
    expect(false).toBe(true);
  });
});

describe('action types', () => {
  test('-> action type snapshot', () => {
    const actionTypes = createActionTypes('my-service');

    expect(actionTypes).toMatchSnapshot();
  });
});
