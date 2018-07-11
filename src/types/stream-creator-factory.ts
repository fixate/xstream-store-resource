export enum RequestStates {
  IDLE = 'idle',
  REQUESTING = 'requesting',
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export enum RequestMethods {
  IDLE = 'idle',
  GETTING = 'getting',
  FINDING = 'finding',
  CREATING = 'creating',
  PATCHING = 'patching',
  UPDATING = 'updating',
  REMOVING = 'removing',
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
