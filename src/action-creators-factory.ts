import {IAction} from 'xstream-store';
// export a function that
//  accepts a name
//  which is used to create all action creators and action types
//  and returns an object exporting all action creators and types

interface IData {
  data: {[key: string]: any};
}
interface IParams {
  params: {[key: string]: any};
}
type ID = string | number;

type CreateActionCreator = (data: IData, params?: IParams) => IAction & {data; params};
type GetActionCreator = (id: ID, params?: IParams) => IAction & {id; params};
type FindActionCreator = (params?: IParams) => IAction & {params};
type UpdateActionCreator = (data: IData, id: ID, params?: IParams) => IAction & {data; id; params};
type PatchActionCreator = UpdateActionCreator;
type RemoveActionCreator = GetActionCreator;

const createActions = name => {};

export default createActions;
