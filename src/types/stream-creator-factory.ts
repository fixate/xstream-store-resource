export enum RequestState {
  Idle,
  Requesting,
  Success,
  Failure,
}

export enum RequestEffect {
  Idle,
  Getting,
  Finding,
  Creating,
  Patching,
  Updating,
  Removing,
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
  requestEffect: RequestEffect;
  requestState: RequestState;
}
