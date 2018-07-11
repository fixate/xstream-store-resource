export enum RequestStates {
  IDLE,
  REQUESTING,
  SUCCESS,
  FAILURE,
}

export enum RequestMethods {
  IDLE,
  GETTING,
  FINDING,
  CREATING,
  PATCHING,
  UPDATING,
  REMOVING,
}

export interface IResource {
  [key: string]: any;
}
export interface IError {
  [key: string]: any;
}
export interface IResourceState {
  entity: IResource | null;
  items: IResource[];
  lastError: IError;
  requestMethod: RequestMethods;
  requestState: RequestStates;
}
